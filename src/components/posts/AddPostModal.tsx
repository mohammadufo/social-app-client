import { useQueryClient } from 'react-query'
import { useMutate } from '../../utils/axios/useRequest'
import { Button, Form, Input, Modal, message } from 'antd'
import { useSelector } from 'react-redux'
import { IGlobalState } from '../../types'

interface Props {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  form: any
  id?: string
}

const AddPostModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  id,
}: Props) => {
  const { postTerm } = useSelector((state: IGlobalState) => state.search)
  const cache = useQueryClient()

  const postPost = useMutate({
    method: 'post',
    url: 'http://localhost:3000/posts',
    successCallback(data) {
      message.success('SuccessFull')
      cache.invalidateQueries('get_all_posts')
      cache.invalidateQueries(postTerm)
      handleCancel()
    },
    errorCallback: () => {
      message.error('Error💥')
    },
  })

  //   const editPost = useMutate({
  //     method: 'put',
  //     url: `http://localhost:3000/posts/${id}`,
  //     successCallback(data) {
  //       message.success();
  //       handleCancel();
  //       cache.invalidateQueries();
  //     },
  //     errorCallback: () => {
  //       message.error();
  //     },
  //   });

  const onFinish = (values: any) => {
    postPost.mutate({
      query: values,
    })
  }

  return (
    <Modal
      title="Add new Post"
      open={isModalOpen}
      centered
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        name="create_activity_tag"
        onFinish={onFinish}
      >
        <div className="w-full">
          <Form.Item
            name="title"
            label="title"
            className="w-full"
            rules={[{ required: true, message: 'this field is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="description"
            className="w-full"
            rules={[{ required: true, message: 'this field is required' }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-full flex justify-start flex-row-reverse gap-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={postPost.isLoading}
            disabled={postPost.isLoading}
          >
            submit
          </Button>
          <Button type="text" onClick={handleCancel}>
            cancel
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddPostModal
