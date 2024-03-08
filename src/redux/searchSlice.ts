import { createSlice } from '@reduxjs/toolkit'

export interface IUserState {
  userTerm: string
  postTerm: string
}

const initialState: IUserState = {
  userTerm: '',
  postTerm: '',
}

export const userSlice: any = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserTerm: (state, action) => {
      state.userTerm = action.payload
    },
    setPostTerm: (state, action) => {
      state.postTerm = action.payload
    },
    clearTerm: (state) => {
      state.postTerm = ''
      state.userTerm = ''
    },
  },
})

export const { setUserTerm, setPostTerm, clearTerm } = userSlice.actions

export default userSlice.reducer
