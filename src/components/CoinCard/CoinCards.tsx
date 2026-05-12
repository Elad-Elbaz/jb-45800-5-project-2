import './CoinCard.css'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../services/redux/hooks'
import coinPriceService from '../../services/coinPriceService'
import { coinPriceInfo } from '../../services/redux/coinPriceSlice'
import type Coin from '../../Models/Coins'
import LoadingSpinner from '../Spinners/LoadingSpinner'

interface CoinCardProps {
    coin: Coin
}

export default function CoinCard(props: CoinCardProps) {
    const { coin } = props
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const savedPrices = useAppSelector(state => state.coinsPriceSlice.coinsPrice)
    const currentPrice = savedPrices.find(price => price.id === coin.id)

    const handleMoreInfo = async () => {
        if (!currentPrice) {
            try {
                setIsLoading(true)
                const coinPrice = await coinPriceService.coinPrice(coin.id)
                dispatch(coinPriceInfo(coinPrice))

            }
            catch (e) {
                alert(e)
                return
            } finally {
                setIsLoading(false)
            }
        }
        setIsOpen(true)
    }

    return (
        <div className="CoinCard">

            <p>{coin.name}</p>

            {!isLoading && <button onClick={handleMoreInfo}>More Info</button>}
            {isLoading && <LoadingSpinner />}

            {isOpen && currentPrice && (

                <div className='modal-overlay'>
                    <div className="modal-content">
                        <h3>{coin.name} Prices</h3>
                        <ul>
                            <li>USD: {currentPrice.market_data.current_price.usd}</li>
                            <li>EUR: {currentPrice.market_data.current_price.eur}</li>
                            <li>ILS: {currentPrice.market_data.current_price.ils}</li>
                        </ul>
                        <button className="close-modal-btn" onClick={() => setIsOpen(false)}>Close</button>

                    </div>
                </div>
            )}
        </div>
    )
}