import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import navbar_stateReducer from './slices/navbarSlice'
import {cartReducer} from './slices/cartSlice'
import fetchedDataSlice from './slices/fetchedDataSlice'

export const store = configureStore({
  reducer: {
      counter: counterReducer,
      navbar_state: navbar_stateReducer,
      cart: cartReducer,
      data_state: fetchedDataSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch