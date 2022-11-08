import { createSlice } from '@reduxjs/toolkit'


export interface NavbarSlice {
  status: 'opened' | 'closed',
  loadingPage: boolean

}

const initialState: NavbarSlice = {
  status: "closed",
  loadingPage: true,
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

    setLoading: (state) =>{
      state.loadingPage = true
    
    },
    setLoaded: (state) =>{
      state.loadingPage = false
    }

  },
})

// Action creators are generated for each case reducer function
export const { open, close, setLoading, setLoaded } = navbarSlice.actions

export default navbarSlice.reducer