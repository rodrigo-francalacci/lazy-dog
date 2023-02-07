import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CollectionsProps } from '../../utils/shopify_colllection_query'



export interface DataState {
    data: CollectionsProps[];
    status: 'loaded' | 'empty'
  }
  
  const initialState: DataState = {
    data: [],
    status: 'empty',
  }

export const fetchedDataSlice = createSlice({
  name: 'data_state',
  initialState,
  reducers: {

    loadDataOnRedux: (state, action: PayloadAction<{fetchedData: CollectionsProps[]}>) => {
        state.data = action.payload.fetchedData
        state.status = 'loaded'
      },

  },
})

// Action creators are generated for each case reducer function
export const { loadDataOnRedux } = fetchedDataSlice.actions

export default fetchedDataSlice.reducer