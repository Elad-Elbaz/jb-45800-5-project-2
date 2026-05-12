import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';



interface SearchState {
    search: string
}


const initialState: SearchState = {
    search:''
}


const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
       
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
     
     
    },
})

// 4. Export the Actions (for the components to use)
export const { setSearch } = searchSlice.actions

// 5. Export the Reducer (for the store to use)
export default searchSlice.reducer
