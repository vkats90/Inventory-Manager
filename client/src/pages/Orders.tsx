import React, { useState, useEffect } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { Order } from '../types'
import { useReadQuery, QueryRef } from '@apollo/client'
import { notify } from '../utils/notify'
import CheckboxDropdown from '../components/filter'
import { compareDates, compareNumbers } from '@/utils/compare'
import { ComparisonOperator } from '../utils/compare'
import SearchWithColumnFilter from '../components/search-with-column-filter'
import { ImagePlus } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import Modal from '../components/modal'
import { Outlet } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const columnHelper = createColumnHelper<Order>()

const initialTableHeaders = {
  id: true,
  name: true,
  quantity: true,
  priority: true,
  status: true,
  created_on: true,
  created_by: true,
  updated_on: true,
  updated_by: true,
  supplier: true,
}

export const OrderList: React.FC<{ orders: Order[]; InitColumns?: typeof initialTableHeaders }> = ({
  orders,
  InitColumns,
}) => {
  const [data, setData] = useState(() => [...orders])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    InitColumns || initialTableHeaders
  )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [operator, setOperator] = useState<ComparisonOperator>('eq')
  const navigate = useNavigate()

  const defaultColumns = [
    columnHelper.accessor('image', {
      header: '',
      meta: { headerClassName: 'w-16' },
      cell: () => (
        <div className="h-8 w-8 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
          <ImagePlus className="h-6 w-6 text-gray-400" />
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: 'ID',
      cell: (info) => info.getValue(),
      enableHiding: false,
    }),
    columnHelper.accessor('items', {
      header: 'Items',
      cell: (info) => info.getValue().length.toString(),
      filterFn: 'includesString',
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => info.getValue(),
      filterFn: (row, id, value) => compareNumbers(row.getValue(id) as number, value, operator),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
    }),
    columnHelper.accessor('created_on', {
      header: 'Created on',
      cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
      filterFn: (row, id, value) => compareDates(row.getValue(id) as Date, value, operator),
    }),
    columnHelper.accessor('created_by', {
      header: 'Created by',
      cell: (info) => info.getValue().name,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('updated_on', {
      header: 'Updated on',
      cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
      filterFn: (row, id, value) => compareDates(row.getValue(id) as Date, value, operator),
    }),
    columnHelper.accessor('updated_by', {
      header: 'Updated by',
      cell: (info) => info.getValue().name,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('supplier', {
      header: 'Supplier',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
    }),
  ]

  const table = useReactTable({
    data,
    columns: defaultColumns,
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  })

  const handleSearch = (query: string, column: string) => {
    if (column === 'all') {
      setGlobalFilter(query)
    } else {
      if (query === '') {
        setColumnFilters([])
        return
      }
      setColumnFilters([{ id: column, value: query }])
    }
  }

  const _handleClick = ({ currentTarget }: React.MouseEvent) => {
    navigate(`/orders/${currentTarget.id}`)
  }

  return (
    <Card>
      {location.pathname != '/orders' && location.pathname != '/' && (
        <Modal onClose={() => navigate('/orders')}>
          <Outlet context={[setData]} />
        </Modal>
      )}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Order List</h2>
        {data.length > 0 && (
          <SearchWithColumnFilter
            columns={table.getAllColumns()}
            onSearch={handleSearch}
            setOperator={setOperator}
          />
        )}
        {data.length > 0 && <CheckboxDropdown options={table.getAllColumns()} />}
      </div>
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`px-4 py-2 ${
                        (header.column.columnDef.meta as any)?.headerClassName || ''
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  id={row.getValue('id')}
                  key={row.id}
                  onClick={_handleClick}
                  className={`border-b hover:bg-gradient-to-r hover:from-primary/30 hover:to-white cursor-pointer ${
                    row.getValue('status') == 'Finished'
                      ? 'bg-green-100'
                      : row.getValue('status') == 'Shipped'
                      ? 'bg-yellow-100'
                      : row.getValue('status') == 'Ordered'
                      ? 'bg-blue-100'
                      : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {data.length === 0 && (
        <div className="text-center text-lg font-medium text-gray-500 my-8">No orders yet</div>
      )}
      <div className="flex justify-end">
        {/*<button
          className="bg-primary hover:bg-primary/80 text-white font-regular my-4 py-1 px-4 rounded shadow-md focus:outline-none focus:shadow-outline"
          onClick={() => {
            navigate('/orders/add-order')
          }}
        >
          Add Order
        </button>*/}
      </div>
    </Card>
  )
}

interface loaderData {
  allOrders: Order[]
}

const OrderPage: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const navigate = useNavigate()

  useEffect(() => {
    if (error && error.graphQLErrors[0].extensions.code === 'UNAUTHORIZED') {
      notify({ error: 'You have to sign in to view this page' })
      navigate('/login')
    }
  }, [error])

  if (error) {
    return <div>Cannot display page</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderList orders={loaderData.allOrders} />
    </div>
  )
}

export default OrderPage
