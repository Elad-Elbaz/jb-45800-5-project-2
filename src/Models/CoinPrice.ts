export default interface CoinPrice {
    id: string,
    market_data: {
        current_price: {
            usd: number,
            eur: number,
            ils: number
        }
    }
}
