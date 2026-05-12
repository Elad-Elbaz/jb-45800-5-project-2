import axios from 'axios'
import type Coin from '../Models/Coins'

class CoinService {
    async coin(): Promise<Coin[]> {
        const { data } = await axios.get<Coin[]>(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`
        )
        return data
    }
}

const coinService = new CoinService()
export default coinService