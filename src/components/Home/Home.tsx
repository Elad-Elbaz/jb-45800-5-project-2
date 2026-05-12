import { useEffect, useState } from 'react'
import { populate } from '../../services/redux/coinsSlice'
import { toggleCoin } from '../../services/redux/buttonSwitchSlice'
import { useAppDispatch, useAppSelector } from '../../services/redux/hooks'
import './Home.css'
import coinService from '../../services/coinServices'
import CoinCard from '../CoinCard/CoinCards'
import LoadingSpinner from '../Spinners/LoadingSpinner'
import SwitchButton from '../SwitchButton/SwitchButton'
import CoinLimitDialog from '../CoinLimitDialog/CoinLimitDialog.tsx'
import type Coin from '../../Models/Coins'

export default function Home() {
  const dispatch = useAppDispatch()
  const coinsSelector = useAppSelector(state => state.coinSlice)
  const searchSelector = useAppSelector(state => state.searchSlice)
  const selectedCoins = useAppSelector(state => state.buttonSwitchSlice.selectedCoins)
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pendingCoin, setPendingCoin] = useState<Coin | null>(null)

  const searchString = searchSelector.search ? searchSelector.search.toLowerCase() : ""

  const filteredCoins = coinsSelector.coins.filter(coin =>
    `${coin.name} ${coin.symbol}`.toLowerCase().includes(searchString)
  )

  const handleSwitchRequest = (coin: Coin) => {
    const isSelected = selectedCoins.some(selectedCoin => selectedCoin.id === coin.id)

    if (isSelected) {
      dispatch(toggleCoin(coin))
      return
    }

    if (selectedCoins.length < 5) {
      dispatch(toggleCoin(coin))
      return
    }

    setPendingCoin(coin)
  }

  useEffect(() => {
    (async () => {
      if (coinsSelector.coins.length === 0) {
        try {
          setIsLoading(true)
          const data = await coinService.coin()
          dispatch(populate(data))
        } catch (e) {
          alert(e)
        } finally {
          setIsLoading(false)
        }
      }
    })()
  }, [coinsSelector.coins.length, dispatch])

  return (
    <div className="Home">
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className="coins-grid">
          {filteredCoins.map(coin => (
            <div key={coin.id} className="coin-item">
              <img src={coin.image} alt={coin.name} />
              <p>({coin.symbol.toUpperCase()})</p>
              <CoinCard coin={coin} />
              <SwitchButton coin={coin} onToggleRequest={handleSwitchRequest} />
            </div>
          ))}
        </div>
      )}
      <CoinLimitDialog pendingCoin={pendingCoin} onClose={() => setPendingCoin(null)} />
    </div>
  )
}