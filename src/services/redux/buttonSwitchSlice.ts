import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type Coin from '../../Models/Coins'




interface buttonSwitch {
    selectedCoins: Coin[]
}

interface ReplaceCoinPayload {
    coinToRemoveId: string
    newCoin: Coin
}


const initialState: buttonSwitch = {
    selectedCoins: []
}


const buttonSwitchSlice = createSlice({
    name: 'buttonSwitchSlice',
    initialState,
    reducers: {

        toggleCoin: (state, action: PayloadAction<Coin>) => {
            const newSelectedCoins = action.payload
         
            const isExistCoin = state.selectedCoins.find(coin => coin.id === newSelectedCoins.id)
            if(isExistCoin) {
                state.selectedCoins = state.selectedCoins.filter(coin => coin.id !== isExistCoin.id)
            } else if(state.selectedCoins.length < 5) {
                state.selectedCoins.push(newSelectedCoins)

            }
        },
        replaceSelectedCoin: (state, action: PayloadAction<ReplaceCoinPayload>) => {
            const { coinToRemoveId, newCoin } = action.payload
            const withoutRemoved = state.selectedCoins.filter(coin => coin.id !== coinToRemoveId)
            const newAlreadyExists = withoutRemoved.some(coin => coin.id === newCoin.id)

            if (!newAlreadyExists && withoutRemoved.length <= 4) {
                state.selectedCoins = [...withoutRemoved, newCoin]
            }
        },
        loadCoinFromStorage: (state, action: PayloadAction<Coin[]>) => {
            state.selectedCoins = action.payload
        }


    },
})

// 4. Export the Actions (for the components to use)
export const { toggleCoin, replaceSelectedCoin, loadCoinFromStorage } = buttonSwitchSlice.actions

// 5. Export the Reducer (for the store to use)
export default buttonSwitchSlice.reducer
