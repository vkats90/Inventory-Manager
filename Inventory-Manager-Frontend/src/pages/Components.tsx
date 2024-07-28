import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate } from 'react-router-dom'
import { Component } from '../types'
import { exampleComponents } from '../assets/data/data'
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

export const ComponentList: React.FC<{ components: Component[]; InitColumns?: string[] }> = ({
  components,
  InitColumns,
}) => {
  const [data, _setData] = useState(() => [...components])
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialPartHeaders)
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
    console.log(currentTarget)
    navigate(`/parts/${currentTarget.id}`)
  }
  return (
    <Card>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Part List</h2>
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
    </Card>
  )
}

const ComponentPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentList components={exampleComponents} />
    </div>
  )
}

export default ComponentPage
