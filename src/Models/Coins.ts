import type CoinPrice from "./CoinPrice";

export default interface Coin extends CoinPrice {
    symbol: string,
    name: string,
    image: string
}