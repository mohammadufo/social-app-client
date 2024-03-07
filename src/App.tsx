import './index.css'
import { setupAxios } from './utils/axios/axios'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Outlet } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import { Provider } from 'react-redux'
import { store } from './redux/store'

function App() {
  setupAxios()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: false,
        retry: 2,
      },
    },
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#00b96b',
            },
            components: {
              Button: {
                primaryColor: '#fff',
              },
            },
          }}
        >
          <Outlet />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
