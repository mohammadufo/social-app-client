import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import searchSlice from './searchSlice'

const rootReducer = combineReducers({
  user: userSlice,
  search: searchSlice,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
