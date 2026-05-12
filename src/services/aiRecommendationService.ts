import axios from 'axios'
import type Coin from '../Models/Coins'

export interface CoinSnapshot {
    name: string
    current_price_usd: number
    market_cap_usd: number
    volume_24h_usd: number
    price_change_percentage_30d_in_currency: number
    price_change_percentage_60d_in_currency: number
    price_change_percentage_200d_in_currency: number
}

export interface AiRecommendation {
    decision: 'buy' | 'dont buy'
    explanation: string
}

interface MarketCoinResponse {
    name: string
    current_price: number
    market_cap: number
    total_volume: number
    price_change_percentage_30d_in_currency: number | null
    price_change_percentage_60d_in_currency: number | null
    price_change_percentage_200d_in_currency: number | null
}

class AiRecommendationService {
    private coingeckoUrl = 'https://api.coingecko.com/api/v3/coins/markets'
    private nvidiaUrl = '/api/nvidia/v1/chat/completions'
    async getCoinSnapshot(coinId: string): Promise<CoinSnapshot> {
        const { data } = await axios.get<MarketCoinResponse[]>(this.coingeckoUrl, {
            params: {
                vs_currency: 'usd',
                ids: coinId,
                price_change_percentage: '30d,60d,200d',
            },
        })

        if (!data.length) {
            throw new Error(`No market data found for coin id: ${coinId}`)
        }

        const coin = data[0]
        return {
            name: coin.name,
            current_price_usd: coin.current_price ?? 0,
            market_cap_usd: coin.market_cap ?? 0,
            volume_24h_usd: coin.total_volume ?? 0,
            price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency ?? 0,
            price_change_percentage_60d_in_currency: coin.price_change_percentage_60d_in_currency ?? 0,
            price_change_percentage_200d_in_currency: coin.price_change_percentage_200d_in_currency ?? 0,
        }
    }

    private buildPrompt(snapshot: CoinSnapshot): string {
        return `
You are a crypto analyst.
Based on the following data, return ONLY valid JSON (without markdown) in this exact schema:
{
  "decision": "buy" | "dont buy",
  "explanation": "string"
}

Coin data:
${JSON.stringify(snapshot, null, 2)}
`
    }

    private safeJsonParse(raw: string): AiRecommendation {
        const cleaned = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned) as AiRecommendation

        if (!parsed.decision || !parsed.explanation) {
            throw new Error('AI response missing required fields')
        }
        if (parsed.decision !== 'buy' && parsed.decision !== 'dont buy') {
            throw new Error('AI decision must be buy or dont buy')
        }
        return parsed
    }

    async recommendForCoin(coin: Coin, apiKey: string): Promise<AiRecommendation> {
        const snapshot = await this.getCoinSnapshot(coin.id)

        const { data } = await axios.post(
            this.nvidiaUrl,
            {
                model: 'meta/llama-3.1-70b-instruct',
                temperature: 0.2,
                messages: [
                    {
                        role: 'system',
                        content: 'Respond strictly as valid JSON and no extra text.',
                    },
                    {
                        role: 'user',
                        content: this.buildPrompt(snapshot),
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        const content: string = data?.choices?.[0]?.message?.content ?? ''
        if (!content) {
            throw new Error(`Empty recommendation for ${coin.name}`)
        }
        return this.safeJsonParse(content)
    }
}

const aiRecommendationService = new AiRecommendationService()
export default aiRecommendationService
