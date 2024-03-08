import { Avatar, Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMutate, useRequest } from '../../utils/axios/useRequest'

const User = ({ item }: { item: any }) => {
  const [isFollowed, setIsFollowed] = useState(false)

  const followReq = useMutate({
    method: 'post',
    url: `http://localhost:3000/users/subscribe/${item?.id}`,
    successCallback(data) {
      message.success(data?.message || 'Followed!')
      setIsFollowed((prev) => !prev)
    },
    errorCallback: () => {
      message.error('')
    },
  })
  const unFollowReq = useMutate({
    method: 'post',
    url: `http://localhost:3000/users/unsubscribe/${item?.id}`,
    successCallback(data) {
      message.success(data?.message || 'Followed!')
      setIsFollowed((prev) => !prev)
    },
    errorCallback: () => {
      message.error('')
    },
  })

  const handleFollow = () => {
    isFollowed ? unFollowReq.mutate({}) : followReq.mutate({})
  }

  const { data: isFollowedData } = useRequest({
    queryKey: [item?.id, isFollowed],
    url: `http://localhost:3000/follow/isFollowed/${item?.id}`,
  })

  useEffect(() => {
    setIsFollowed(!!isFollowedData)
  }, [isFollowedData])

  return (
    <div className="p-5 w-48 rounded-md border-solid border-primary flex gap-5 flex-col items-center justify-between ">
      <Avatar
        src={
          item?.profileImage ||
          'https://api.dicebear.com/7.x/miniavs/svg?seed=8'
        }
      />
      <span className="truncate">{item?.username}</span>
      <Button type="primary" onClick={handleFollow}>
        {isFollowed ? 'unFollow' : 'Follow'}
      </Button>
    </div>
  )
}

export default User
