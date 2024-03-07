import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

export interface IUserState {
  accessToken: string
  refreshToken: string
  userInfo: any
}

const accessToken = Cookies.get('accessToken') || ''
const refreshToken = Cookies.get('refreshToken') || ''

const initialState: IUserState = {
  accessToken,
  refreshToken,
  userInfo: null,
}

export const userSlice: any = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    setProfile: (state, action) => {
      state.userInfo = action.payload
    },
    logout: (state) => {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      state.accessToken = ''
      state.refreshToken = ''
    },
  },
})

export const { login, setProfile, logout } = userSlice.actions

export default userSlice.reducer
