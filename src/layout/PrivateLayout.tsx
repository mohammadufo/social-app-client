import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { IGlobalState } from '../types'
import { useRequest } from '../utils/axios/useRequest'
import { setProfile } from '../redux/userSlice'
import { Navigate } from 'react-router-dom'

const PrivateLayout = () => {
  const { accessToken } = useSelector((state: IGlobalState) => state.user)
  const dispatch = useDispatch()

  const { data, isLoading } = useRequest({
    queryKey: 'profile',
    url: 'http://localhost:3000/users/profile',
  })

  console.log(data)

  dispatch(setProfile(data))

  if (accessToken) {
    return (
      <div>
        <Outlet />
      </div>
    )
  } else {
    return <Navigate to="/login" />
  }
}

export default PrivateLayout
