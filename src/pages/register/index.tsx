import { Button, message, Form, Input, Card } from 'antd'
import { useMutate } from '../../utils/axios/useRequest'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const registerReq = useMutate({
    method: 'post',
    url: 'http://localhost:3000/authentication/sign-up',
    successCallback(data) {
      message.success('Successfully submitted please login')
      navigate('/login')
    },
    errorCallback: () => {
      message.error('')
    },
  })

  const onFinish = (values: any) => {
    registerReq.mutate({
      query: values,
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card title="Register" style={{ width: 400 }}>
        <Form
          name="register"
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
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
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

          <Link to="/login" className="text-primary w-full text-center block">
            have an Account ?
          </Link>
        </Form>
      </Card>
    </div>
  )
}

export default Register
