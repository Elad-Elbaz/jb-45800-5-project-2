import { useMemo, useState } from 'react'
import type Coin from '../../Models/Coins'
import { useAppDispatch, useAppSelector } from '../../services/redux/hooks'
import { setAiApiKey } from '../../services/redux/aiSettingsSlice'
import aiRecommendationService, {
    type AiRecommendation,
} from '../../services/aiRecommendationService'
import RecommendationCard from './RecommendationCard'
import './Ai.css'

type RecommendationMap = Record<string, AiRecommendation>
type LoadingMap = Record<string, boolean>

export default function Ai() {
    const dispatch = useAppDispatch()
    const selectedCoins = useAppSelector(state => state.buttonSwitchSlice.selectedCoins)
    const apiKey = useAppSelector(state => state.aiSettingsSlice.apiKey)

    const [recommendations, setRecommendations] = useState<RecommendationMap>({})
    const [loadingByCoin, setLoadingByCoin] = useState<LoadingMap>({})
    const [globalLoading, setGlobalLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [tempKeyInput, setTempKeyInput] = useState<string>('') // For the UI input

    const hasCoins = selectedCoins.length > 0
    const canRequest = apiKey.trim().length > 0 && hasCoins

    const sortedCoins = useMemo(
        () => [...selectedCoins].sort((a, b) => a.name.localeCompare(b.name)),
        [selectedCoins]
    )

    // Handlers for fetching data
    const recommendOne = async (coin: Coin) => {
        if (!apiKey.trim()) return

        try {
            setError('')
            setLoadingByCoin(prev => ({ ...prev, [coin.id]: true }))
            const rec = await aiRecommendationService.recommendForCoin(coin, apiKey)
            setRecommendations(prev => ({ ...prev, [coin.id]: rec }))
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to get recommendation.')
        } finally {
            setLoadingByCoin(prev => ({ ...prev, [coin.id]: false }))
        }
    }

    const recommendAll = async () => {
        if (!canRequest) return

        try {
            setError('')
            setGlobalLoading(true)

            setLoadingByCoin(
                selectedCoins.reduce<LoadingMap>((acc, coin) => {
                    acc[coin.id] = true
                    return acc
                }, {})
            )

            const results = await Promise.all(
                selectedCoins.map(async coin => {
                    const rec = await aiRecommendationService.recommendForCoin(coin, apiKey)
                    return { coinId: coin.id, rec }
                })
            )

            const recommendationMap: RecommendationMap = {}
            results.forEach(item => {
                recommendationMap[item.coinId] = item.rec
            })

            setRecommendations(prev => ({ ...prev, ...recommendationMap }))
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to get all recommendations.')
        } finally {
            setGlobalLoading(false)
            setLoadingByCoin({})
        }
    }

    // Handler for saving the API key from the UI
    const handleSaveKey = () => {
        if (tempKeyInput.trim()) {
            dispatch(setAiApiKey(tempKeyInput.trim()))
        }
    }

    return (
        <div className="Ai">
            <h2>AI Recommendations</h2>

            {/* Check if we have an API key in Redux first */}
            {!apiKey.trim() ? (
                <div className="api-key-setup">
                    <p>Please enter your Nvidia API key to get AI recommendations:</p>
                    <input
                        type="password"
                        value={tempKeyInput}
                        onChange={e => setTempKeyInput(e.target.value)}
                        placeholder="api-..."
                    />
                    <button type="button" onClick={handleSaveKey} disabled={!tempKeyInput.trim()}>
                        Save Key
                    </button>
                </div>
            ) : (
                <>
                    {!hasCoins && <p>Select coins in Home first (up to 5).</p>}

                    {hasCoins && (
                        <>
                            <button type="button" onClick={recommendAll} disabled={!canRequest || globalLoading}>
                                {globalLoading ? 'Loading all...' : 'Get recommendations for all selected coins'}
                            </button>

                            <div className="ai-coin-list">
                                {sortedCoins.map(coin => (
                                    <RecommendationCard
                                        key={coin.id}
                                        coin={coin}
                                        recommendation={recommendations[coin.id]}
                                        loading={!!loadingByCoin[coin.id]}
                                        onRecommend={recommendOne}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {error && <p className="ai-error">{error}</p>}
        </div>
    )
}