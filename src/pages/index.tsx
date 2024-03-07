import React from 'react'
import { Button, message, Form, type FormProps, Input, Card } from 'antd'
import { useMutate } from '../utils/axios/useRequest'
import Cookies from 'js-cookie'

const Login = () => {
  const loginReq = useMutate({
    method: 'post',
    url: 'http://localhost:3000/authentication/sign-in',
    successCallback(data) {
      message.success('Welcome!')
      console.log(data)
      Cookies.set('accessToken', data?.accessToken)
      Cookies.set('refreshToken', data?.refreshToken)
    },
    errorCallback: () => {
      message.error('')
    },
  })

  const onFinish = (values: any) => {
    console.log('Success:', values)
    loginReq.mutate({
      query: values,
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card title="Login" style={{ width: 400 }}>
        <Form
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            className="w-full"
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your username!' },
              { type: 'email', message: 'Email is not valid!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="w-full"
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password Must more that 8 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
