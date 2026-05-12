import type Coin from '../../Models/Coins'
import { useAppSelector } from '../../services/redux/hooks'
import './SwitchButton.css'

interface SwitchButtonProps {
    coin: Coin
    onToggleRequest: (coin: Coin) => void
}

export default function SwitchButton({ coin, onToggleRequest }: SwitchButtonProps) {
    const selectedCoins = useAppSelector(state => state.buttonSwitchSlice.selectedCoins)
    const isOn = selectedCoins.some(selectedCoin => selectedCoin.id === coin.id)
    
    return (
        <button
            type="button"
            className={`switch-container ${isOn ? 'on' : 'off'}`}
            onClick={() => onToggleRequest(coin)}
            aria-label={`Toggle ${coin.name}`}
            aria-pressed={isOn}
        >
            <span className="switch-handle" />
        </button>
    )
}