export interface RequestQuery {
  queryKey: string | any[]
  url: string
  staleTime?: number | 'Infinity'
  enabled?: boolean
  successCallback?: (data: any) => void
  errorCallback?: (error: string) => void | undefined
  query?: any
  refetchOnWindowFocus?: any
  token?: string
}

export interface MutateQuery {
  method: 'post' | 'delete' | 'patch' | 'put'
  url?: string
  successCallback?: (data: any) => void
  errorCallback?: (error: string) => void
  header?: any
  preventDefaultMessage?: boolean
}

export interface QueryParam {
  query?: any
  id?: string
  requestUrl?: string
}

export interface ErrorHandler {
  error: ErrorFormat
  errorCallback: (data: any) => void
  isGetMethod: boolean
  preventDefaultMessage: boolean
}

export interface ErrorFormat {
  statusCode: number
  message: string
  timestamp: string
}

export interface IaxiosConfig {
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Credentials': Boolean
  'Access-Control-Allow-Methods': string
  'Content-Type': string
  'x-client-id': string
  'Accept-Language': string
  'Acccept-Encoding': string
  'Access-Control-Max_Age': number
  'Access-Control-Allow-Headers': string
  Authorization: string
}
