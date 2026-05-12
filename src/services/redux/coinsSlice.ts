import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type Coin from '../../Models/Coins'



interface CoinsState {
    coins: Coin[]
}


const initialState: CoinsState = {
    coins: [],
}


const coinsSlice = createSlice({
    name: 'coinSlice',
    initialState,
    reducers: {
       
        populate: (state, action: PayloadAction<Coin[]>) => {
            state.coins = action.payload
        },
     
     
    },
})

// 4. Export the Actions (for the components to use)
export const { populate } = coinsSlice.actions

// 5. Export the Reducer (for the store to use)
export default coinsSlice.reducer
