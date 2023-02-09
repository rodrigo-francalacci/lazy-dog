import { createSlice } from '@reduxjs/toolkit'


export interface NavbarSlice {
  status: 'opened' | 'closed',
  loadingPage: boolean,
  transition: boolean

}

const initialState: NavbarSlice = {
  status: "closed",
  loadingPage: true,
  transition: true
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
    },

    setTransitionOn: (state) =>{
      state.transition = true
    },

    setTransitionOff: (state) =>{
      state.transition = false
    },

  },
})

// Action creators are generated for each case reducer function
export const { open, close, setLoading, setLoaded, setTransitionOff, setTransitionOn } = navbarSlice.actions

export default navbarSlice.reducer