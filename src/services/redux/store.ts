import { configureStore } from '@reduxjs/toolkit'
import coinSlice from './coinsSlice'
import searchSlice from './searchSlice'
import coinsPriceSlice from './coinPriceSlice'
import buttonSwitchSlice from './buttonSwitchSlice'
import aiSettingsSlice from './aiSettingsSlice'
const store = configureStore({
    reducer: {
        coinSlice: coinSlice,
        searchSlice: searchSlice,
        coinsPriceSlice: coinsPriceSlice,
        buttonSwitchSlice: buttonSwitchSlice,
        aiSettingsSlice: aiSettingsSlice

    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store