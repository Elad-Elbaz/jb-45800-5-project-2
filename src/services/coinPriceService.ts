import axios from 'axios'
import type CoinPrice from '../Models/CoinPrice'

class CoinPriceService {
    async coinPrice(id : string): Promise<CoinPrice> {
        const { data } = await axios.get<CoinPrice>(
            `https://api.coingecko.com/api/v3/coins/${id}` )


          const coinMap : CoinPrice = {
           id: data.id,
           market_data: {
               current_price: {
                   usd: data.market_data.current_price.usd,
                   eur: data.market_data.current_price.eur,
                   ils: data.market_data.current_price.ils
               }
           }
          }
        return coinMap
    }
}

const coinPriceService = new CoinPriceService()
export default coinPriceService