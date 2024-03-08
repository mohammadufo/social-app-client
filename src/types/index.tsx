export interface IGlobalState {
  user: {
    accessToken: string
    refreshToken: string
    userInfo: any
  }
  search: {
    userTerm: string
    postTerm: string
  }
}
