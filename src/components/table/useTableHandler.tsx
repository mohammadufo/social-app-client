import { useState } from 'react'
import { useRequest } from '../../utils/axios/useRequest'

interface Props {
  url: string
  queryKey: string | string[]
  enabled?: boolean
  refetchOnWindowFocus?: any
  params?: any
  term?: string | null
  filters?: any[]
  order?: any
}

export const useTableHandler = ({
  queryKey,
  url,
  enabled,
  refetchOnWindowFocus,
  params,
  term = null,
  filters = [],
  order = null,
}: Props) => {
  const [page, setPage] = useState(1)
  const [dataPerPage, setDataPerPage] = useState(10)
  const [totalData, setTotalData] = useState()
  const [dataStartIndex, setDataStartIndex] = useState(0)
  const [tableData, setTableData] = useState<any>([])

  const getCurrentPage = (pageIndex: number) => setPage(pageIndex)
  const getDataPerPage = (dataPerPage: number) => setDataPerPage(dataPerPage)

  let allFilters: any = {}

  if (filters) {
    filters.forEach((obj) => {
      const key = Object.keys(obj)[0]
      const value = obj[key]
      allFilters[`filters[${key}]`] = value
    })
  }

  const { isLoading: loading, isFetching } = useRequest({
    queryKey: [
      ...queryKey,
      {
        page,
        dataPerPage,
        ...(params && { ...params }),
        ...(term && { term }),
        ...(filters && { ...allFilters }),
        ...(order && order),
      },
    ],
    refetchOnWindowFocus: refetchOnWindowFocus,
    url,
    successCallback: (data) => {
      setTableData(data.items)
      setTotalData(data.pagination?.total)
      setDataStartIndex(data.pagination?.skip + 1)
    },
    enabled,
    query: {
      params: {
        page: page,
        size: dataPerPage,
        ...(term && { 'filters[term]': term }),
        ...(filters && allFilters),
        ...(order && order),
        ...(!term && filters.length === 0 && { 'filters[]': '' }),
      },
    },
  })

  return {
    page,
    setPage,
    dataPerPage,
    setDataPerPage,
    totalData,
    setTotalData,
    dataStartIndex,
    setDataStartIndex,
    getCurrentPage,
    getDataPerPage,
    tableData,
    loading: loading || isFetching,
  }
}

export default useTableHandler
