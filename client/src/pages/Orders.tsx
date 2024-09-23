import React, { useState, useEffect } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { Order } from '../types'
import { useReadQuery, QueryRef } from '@apollo/client'
import { notify } from '../utils/notify'
import CheckboxDropdown from '../components/filter'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
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

const defaultColumns = [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
    enableHiding: false,
  }),
  columnHelper.accessor('item', {
    header: 'Item',
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_on', {
    header: 'Created on',
    cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
  }),
  columnHelper.accessor('created_by', {
    header: 'Created by',
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor('updated_on', {
    header: 'Updated on',
    cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
  }),
  columnHelper.accessor('updated_by', {
    header: 'Updated by',
    cell: (info) => info.getValue().name,
  }),
  columnHelper.accessor('supplier', {
    header: 'Supplier',
    cell: (info) => info.getValue(),
  }),
]

const initialTableHeaders = {
  id: false,
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
  const navigate = useNavigate()

  const table = useReactTable({
    data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  })

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
        <CheckboxDropdown options={table.getAllColumns()} />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2">
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
      <div className="flex justify-end">
        <button
          className="bg-primary hover:bg-primary/80 text-white font-regular my-4 py-1 px-4 rounded shadow-md focus:outline-none focus:shadow-outline"
          onClick={() => {
            navigate('/orders/add-order')
          }}
        >
          Add Order
        </button>
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
