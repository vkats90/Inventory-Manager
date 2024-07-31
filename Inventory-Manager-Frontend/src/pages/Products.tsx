import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { Product } from '../types'
//import { exampleProducts } from '../assets/data/data'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table'
import CheckboxDropdown from '../components/filter'

const initialTableHeaders = {
  id: false,
  name: true,
  stock: true,
  cost: true,
  price: true,
  SKU: true,
  parts: true,
  componenets: true,
}

const columnHelper = createColumnHelper<Product>()

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
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('SKU', {
    header: 'SKU',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('components', {
    header: 'Components',

    cell: (info) =>
      info.getValue()
        ? //@ts-ignore
          info
            .getValue()
            .map((c) => c.name)
            .join(', ')
        : 'None',
  }),
]

export const ProductList: React.FC<{
  products: Product[]
  InitColumns?: typeof initialTableHeaders
}> = ({ products, InitColumns }) => {
  const [data, _setData] = useState(() => [...products])
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
    console.log(currentTarget)
    navigate(`/products/${currentTarget.id}`)
  }

  return (
    <Card>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Product List</h2>
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
    </Card>
  )
}
interface loaderData {
  data: Product[]
}

const ProductPage: React.FC = () => {
  const { data: loaderData } = useLoaderData() as loaderData
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList products={loaderData} />
    </div>
  )
}

export default ProductPage
