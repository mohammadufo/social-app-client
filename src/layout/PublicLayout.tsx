import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Outlet />
    </div>
  )
}

export default PublicLayout
