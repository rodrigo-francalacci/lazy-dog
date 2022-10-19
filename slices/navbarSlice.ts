import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NavbarSlice {
  status: 'opened' | 'closed',

}

const initialState: NavbarSlice = {
  status: "closed"
}

export const navbarSlice = createSlice({
  name: 'navbar_state',
  initialState,
  reducers: {

    open: (state) => {
        state.status = "opened"
    },
    close: (state) => {
        state.status = "closed"
    },


  },
})

// Action creators are generated for each case reducer function
export const { open, close } = navbarSlice.actions

export default navbarSlice.reducer