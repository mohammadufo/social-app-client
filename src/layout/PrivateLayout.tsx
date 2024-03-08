import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { IGlobalState } from '../types'
import { useRequest } from '../utils/axios/useRequest'
import { logout, setProfile } from '../redux/userSlice'
import { Navigate } from 'react-router-dom'
import {
  UserOutlined,
  SearchOutlined,
  FileImageOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, FloatButton, Input, Layout, Menu, theme } from 'antd'
import defAvatar from '/avatar.png'
import { clearTerm, setPostTerm, setUserTerm } from '../redux/searchSlice'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

const { Header, Content, Footer, Sider } = Layout

const Menuitems = [
  {
    key: 1,
    icon: <FileImageOutlined />,
    label: <Link to="/">posts</Link>,
  },
  {
    key: 2,
    icon: <UserOutlined />,
    label: <Link to="/users">users</Link>,
  },
  {
    key: 3,
    icon: <UserOutlined />,
    label: <Link to="/profile">profile</Link>,
  },
]

const PrivateLayout = () => {
  const cache = useQueryClient()

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const location = useLocation()

  const { accessToken, userInfo } = useSelector(
    (state: IGlobalState) => state.user
  )
  const dispatch = useDispatch()

  const { data, isLoading } = useRequest({
    queryKey: 'profile',
    url: `http://localhost:3000/users/profile`,
  })

  const items: MenuProps['items'] = [
    {
      label: userInfo?.username,
      key: '0',
    },
    {
      label: <Link to="/profile">See Profile</Link>,
      key: '1',
    },
    {
      label: (
        <span className="w-full block" onClick={() => dispatch(logout())}>
          Logout
        </span>
      ),
      key: '3',
    },
  ]

  dispatch(setProfile(data))

  useEffect(() => {
    dispatch(clearTerm())
  }, [location.pathname])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    location.pathname === 'users'
      ? dispatch(setUserTerm(e.target.value))
      : dispatch(setPostTerm(e.target.value))

    cache.invalidateQueries('get_all_posts')
  }

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical">
          <h2 className="w-full text-center text-primary">Social App.</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={Menuitems}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{ background: colorBgContainer }}
          className="flex items-center justify-between px-8"
        >
          <div className=""></div>
          <div className="">
            <Input
              placeholder="Search"
              onChange={(e) => handleChange(e)}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </div>
          <div className="cursor-pointer">
            <Dropdown menu={{ items }} trigger={['click']}>
              <Avatar src={userInfo?.profileImage || defAvatar} />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          {accessToken ? (
            <div>
              <Outlet />
            </div>
          ) : (
            <Navigate to="/login" />
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ©{new Date().getFullYear()} Created by Muhammad UFO
        </Footer>
      </Layout>
    </Layout>
  )
}

export default PrivateLayout
