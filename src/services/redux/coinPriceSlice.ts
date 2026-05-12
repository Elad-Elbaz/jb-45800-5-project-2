import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type CoinPrice from '../../Models/CoinPrice'




interface CoinsState {
    coinsPrice: CoinPrice[]
}


const initialState: CoinsState = {
    coinsPrice: [],
}


const coinsPriceSlice = createSlice({
    name: 'coinPriceSlice',
    initialState,
    reducers: {
       
        coinPriceInfo: (state, action: PayloadAction<CoinPrice>) => {
            state.coinsPrice.push(action.payload)
        },
     
     
    },
})

// 4. Export the Actions (for the components to use)
export const { coinPriceInfo } = coinsPriceSlice.actions

// 5. Export the Reducer (for the store to use)
export default coinsPriceSlice.reducer
