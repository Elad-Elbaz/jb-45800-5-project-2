import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AiSettingsState {
    apiKey: string
}

const initialState: AiSettingsState = {
    apiKey: '',
}

const aiSettingsSlice = createSlice({
    name: 'aiSettingsSlice',
    initialState,
    reducers: {
        setAiApiKey: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload.trim()
        },
    },
})

export const { setAiApiKey } = aiSettingsSlice.actions
export default aiSettingsSlice.reducer
