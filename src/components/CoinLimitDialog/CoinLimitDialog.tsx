import { useState } from 'react'
import type Coin from '../../Models/Coins'
import { useAppDispatch, useAppSelector } from '../../services/redux/hooks'
import { replaceSelectedCoin } from '../../services/redux/buttonSwitchSlice'
import './CoinLimitDialog.css'

interface CoinLimitDialogProps {
    pendingCoin: Coin | null
    onClose: () => void
}

export default function CoinLimitDialog({ pendingCoin, onClose }: CoinLimitDialogProps) {
    const dispatch = useAppDispatch()
    const selectedCoins = useAppSelector(state => state.buttonSwitchSlice.selectedCoins)
    const [coinToRemoveId, setCoinToRemoveId] = useState<string>('')

    if (!pendingCoin) return null

    const handleConfirm = () => {
        if (!coinToRemoveId) return

        dispatch(
            replaceSelectedCoin({
                coinToRemoveId,
                newCoin: pendingCoin,
            })
        )
        onClose()
    }

    return (
        <div className="coin-limit-overlay" role="presentation">
            <div
                className="coin-limit-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="coin-limit-title"
            >
                <h3 id="coin-limit-title">You can select up to 5 coins</h3>
                <p>
                    To select <strong>{pendingCoin.name}</strong>, choose one coin to remove:
                </p>

                <div className="coin-limit-options">
                    {selectedCoins.map(coin => (
                        <label key={coin.id} className="coin-limit-option">
                            <input
                                type="radio"
                                name="coinToRemove"
                                value={coin.id}
                                checked={coinToRemoveId === coin.id}
                                onChange={() => setCoinToRemoveId(coin.id)}
                            />
                            <span>
                                {coin.name} ({coin.symbol.toUpperCase()})
                            </span>
                        </label>
                    ))}
                </div>

                <div className="coin-limit-actions">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" onClick={handleConfirm} disabled={!coinToRemoveId}>
                        Replace & Select
                    </button>
                </div>
            </div>
        </div>
    )
}
