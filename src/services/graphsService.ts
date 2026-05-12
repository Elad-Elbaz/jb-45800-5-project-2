import axios from 'axios'
import type Graph from '../Models/Graph'

class GraphService {
    async graph(coinSymbol: string): Promise<Graph> {
        const { data } = await axios.get<Graph>(
            `https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=${coinSymbol}`
        )
        return data
    }
}

const graphService = new GraphService()
export default graphService