import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { Component } from '../types'
import Modal from '../components/modal'
import { Outlet } from 'react-router-dom'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table'

import CheckboxDropdown from '../components/filter'

const initialPartHeaders = { name: true, stock: true, cost: true, id: false }

const columnHelper = createColumnHelper<Component>()

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
  columnHelper.accessor('stock', {
    header: 'Stock',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cost', {
    header: 'Cost',
    cell: (info) => info.getValue(),
  }),
]

export const ComponentList: React.FC<{
  components: Component[]
  InitColumns?: typeof initialPartHeaders
}> = ({ components, InitColumns }) => {
  const [showModal, setShowModal] = useState(false)
  const [data, _setData] = useState(() => [...components])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    InitColumns || initialPartHeaders
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
    setShowModal(true)
    navigate(`/parts/${currentTarget.id}`)
  }
  return (
    <Card>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <Outlet />
        </Modal>
      )}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Part List</h2>
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
                className={`border-b hover:bg-slate-200 cursor-pointer`}
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
      <div className="flex justify-end">
        <button
          className="bg-slate-800 hover:bg-slate-700 text-white font-regular my-4 py-1 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            setShowModal(true)
            navigate('/parts/add-part')
          }}
        >
          Add Part
        </button>
      </div>
    </Card>
  )
}

interface loaderData {
  data: Component[]
}

const ComponentPage: React.FC = () => {
  const { data: loaderData } = useLoaderData() as loaderData

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentList components={loaderData} />
    </div>
  )
}

export default ComponentPage
