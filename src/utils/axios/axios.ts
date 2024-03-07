import Cookies from 'js-cookie'
import axios from 'axios'

// Initialize an agent at application startup.
let visitorId = ''

// Analyze the visitor when necessary.

const API_URL = import.meta.env.VITE_API_URL

let isRefreshing = false
let refreshSubscribers: any[] = []

// Function to refresh tokens
async function refreshTokens(refreshToken: string | undefined) {
  try {
    const response = await fetch(`${API_URL}auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
        'x-client-id': visitorId,
      },
      body: JSON.stringify({
        refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh tokens: ${response.status}`)
    }

    const { accessToken, refreshToken: newRefreshToken } = await response.json()

    // Update tokens in store
    // dispatch(login({ accessToken, refreshToken: newRefreshToken }));

    // Update tokens in cookies
    Cookies.set('accessToken', accessToken)
    Cookies.set('refreshToken', newRefreshToken)

    // Retry all queued requests
    refreshSubscribers.forEach((callback) => callback(accessToken))

    // Clear subscribers array
    refreshSubscribers = []
  } catch (error) {
    console.error('Token refresh failed:', error)

    // Log out user and clear tokens
    // dispatch(logout());
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
  } finally {
    isRefreshing = false
  }
}

export function setupAxios() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  //   const dispatch = useDispatch();
  axios.defaults.baseURL = API_URL
  const currentLanguage = localStorage.getItem('i18nConfig')
  const parsedLanguage = currentLanguage
    ? JSON.parse(currentLanguage).selectedLang
    : 'en'

  axios.interceptors.request.use(
    (config: any) => {
      config.headers['Access-Control-Allow-Origin'] = '*'
      config.headers['Access-Control-Allow-Credentials'] = true
      config.headers['Access-Control-Allow-Methods'] =
        'GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH'
      config.headers['Content-Type'] = 'application/json'
      config.headers['x-client-id'] = visitorId
      config.headers['Accept-Language'] = parsedLanguage
      config.headers['Acccept-Encoding'] = 'gzip, deflate, br'
      config.headers['Access-Control-Max_Age'] = 36000
      config.headers['Access-Control-Allow-Headers'] =
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, access-control-allow-origin, x-app-key, x-role, x-client-version, x-client-id, sentry-trace, client-id, device-id, menu-access, role-permission, user-agent, user'

      const accessToken = Cookies.get('accessToken')

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )

  axios.interceptors.response.use(
    (response: any) => {
      return response
    },
    async (error: any) => {
      // Check if the error is due to expired token
      if (
        error.response &&
        error.response.status === 401 &&
        !error.config._retry
      ) {
        // Check if token refresh is already in progress
        if (!isRefreshing) {
          isRefreshing = true

          // Call refreshTokens function to refresh tokens
          await refreshTokens(Cookies.get('refreshToken'))
        }

        // Return new Promise to retry the failed request after tokens are refreshed
        return new Promise((resolve, reject) => {
          // Add callback function to refreshSubscribers array
          refreshSubscribers.push((accessToken: string) => {
            // Update authorization header with new access token
            error.config.headers.Authorization = `Bearer ${accessToken}`

            // Retry the request
            resolve(axios(error.config))
          })
        })
      }

      return Promise.reject(error)
    }
  )
}
