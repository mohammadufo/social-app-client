import { FloatButton, Form, Pagination, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useTableHandler from '../table/useTableHandler'
import Post from './Post'
import { useEffect, useState } from 'react'
import AddPostModal from './AddPostModal'
import { useSelector } from 'react-redux'
import { IGlobalState } from '../../types'

const Posts = () => {
  const { postTerm } = useSelector((state: IGlobalState) => state.search)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleShowModal = () => {
    setIsModalOpen(true)
  }

  const handleOkModal = () => {
    setIsModalOpen(false)
  }

  const handleCancelModal = () => {
    setIsModalOpen(false)
  }

  const { page, setPage, setDataPerPage, totalData, tableData, loading } =
    useTableHandler({
      queryKey: ['get_all_posts', postTerm],
      url: `http://localhost:3000/posts/paginated?term=${postTerm}`,
    })

  return (
    <div className="flex flex-wrap items-center gap-4">
      {tableData?.map((item: any) => (
        <div key={item?.id}>
          <Post
            postId={item?.id}
            title={item?.title}
            desc={item?.description}
            image={item?.imageUrl}
            user={item?.user}
          />
        </div>
      ))}

      <div className="w-full mt-5 flex justify-center">
        <Pagination
          total={totalData}
          current={page}
          locale={{ items_per_page: 'page' }}
          showSizeChanger
          responsive
          onChange={(page, pageSize) => {
            setPage(page)
            setDataPerPage(pageSize)
          }}
          onShowSizeChange={(current, size) => {
            setPage(current)
            setDataPerPage(size)
          }}
        />
      </div>

      <Tooltip title="Add new Post">
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleShowModal()}
        />
      </Tooltip>

      <AddPostModal
        form={form}
        handleCancel={handleCancelModal}
        handleOk={handleOkModal}
        isModalOpen={isModalOpen}
      />
    </div>
  )
}

export default Posts
