import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { Order } from '../types'
//import { exampleOrders } from '../assets/data/data'
import CheckboxDropdown from '../components/filter'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<Order>()

const defaultColumns = [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
    enableHiding: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
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
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor('created_by.name', {
    header: 'Created by',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_on', {
    header: 'Updated on',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor('updated_by.name', {
    header: 'Updated by',
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
}

export const OrderList: React.FC<{ orders: Order[]; InitColumns?: typeof initialTableHeaders }> = ({
  orders,
  InitColumns,
}) => {
  const [data, _setData] = useState(() => [...orders])
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
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Order List</h2>
        <CheckboxDropdown options={table.getAllColumns()} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-200 text-left">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                id={row.getValue('id')}
                key={row.id}
                onClick={_handleClick}
                className={`border-b hover:bg-slate-200 cursor-pointer ${
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
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

interface loaderData {
  data: Order[]
}

const OrderPage: React.FC = () => {
  const { data: loaderData } = useLoaderData() as loaderData
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderList orders={loaderData} />
    </div>
  )
}

export default OrderPage
