import { Avatar, Card, Form, message } from 'antd'
import { LikeOutlined, LikeFilled, DeleteOutlined } from '@ant-design/icons'
import Meta from 'antd/es/card/Meta'
import PostImg from '/post-defualt.jpeg'
import { useMutate, useRequest } from '../../utils/axios/useRequest'
import { useQueryClient } from 'react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IGlobalState } from '../../types'

const Post = ({
  image,
  title,
  desc,
  user,
  postId,
}: {
  image: string
  title: string
  desc: string
  user: any
  postId: string
}) => {
  const [likeStatus, setLikeStatus] = useState(false)

  const { userInfo } = useSelector((state: IGlobalState) => state.user)

  const { data: isLiked } = useRequest({
    queryKey: [postId, 'statusLike'],
    url: `http://localhost:3000/like/isliked/${postId}`,
  })

  const cache = useQueryClient()

  const LikeReq = useMutate({
    method: 'post',
    url: `http://localhost:3000/users/like/${postId}`,
    successCallback(data) {
      message.success(data?.message || 'Liked!')
    },
    errorCallback: () => {
      message.error('')
    },
  })

  const deletePost = useMutate({
    method: 'delete',
    url: `http://localhost:3000/posts/${postId}`,
    successCallback(data) {
      cache.invalidateQueries('get_all_posts')
      message.success('Successfully deleted!')
    },
    errorCallback: () => {
      message.error('Error')
    },
  })

  const handleLike = () => {
    LikeReq.mutate({})
    cache.invalidateQueries('statusLike')
    setLikeStatus((prev) => !prev)
  }

  useEffect(() => {
    setLikeStatus(isLiked)
  }, [isLiked])

  return (
    <Card
      style={{ width: 300 }}
      cover={<img alt="example" src={image || PostImg} />}
      actions={[
        <span>
          {likeStatus ? (
            <LikeFilled key="setting" onClick={handleLike} />
          ) : (
            <LikeOutlined key="setting" onClick={handleLike} />
          )}
        </span>,

        <span>
          {userInfo?.id === user?.id || userInfo?.role === 'admin' ? (
            <span
              className="text-red-500"
              onClick={() => deletePost.mutate({})}
            >
              <DeleteOutlined />
            </span>
          ) : null}
        </span>,
      ]}
    >
      <Meta title={title} description={desc} />

      <div className="flex items-center gap-2 mt-4">
        <Avatar
          src={
            user?.profileImage ||
            'https://api.dicebear.com/7.x/miniavs/svg?seed=8'
          }
        />
        <div>
          <span>{user?.username}</span>
        </div>
      </div>
    </Card>
  )
}

export default Post
