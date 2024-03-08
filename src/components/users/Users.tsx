import { Avatar, Button, FloatButton, Form, Pagination, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useTableHandler from '../table/useTableHandler'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IGlobalState } from '../../types'
import { useMutate } from '../../utils/axios/useRequest'
import User from './User'

const Users = () => {
  const { user, search } = useSelector((state: IGlobalState) => state)

  const { page, setPage, setDataPerPage, totalData, tableData, loading } =
    useTableHandler({
      queryKey: ['get_all_users', search?.userTerm],
      url: `http://localhost:3000/users/paginated?term=${search?.userTerm}`,
    })

  return (
    <div className="flex flex-wrap items-center gap-4">
      {tableData
        ?.filter((_item: any) => _item?.id !== user?.userInfo?.id)
        ?.map((item: any) => (
          <div key={item?.id}>
            <User item={item} />
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
    </div>
  )
}

export default Users
