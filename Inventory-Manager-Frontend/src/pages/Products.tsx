import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom'
import { Product } from '../types'
import { useReadQuery, QueryRef } from '@apollo/client'
import { notify } from '../utils/notify'

//import { exampleProducts } from '../assets/data/data'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table'
import CheckboxDropdown from '../components/filter'
import Modal from '../components/modal'
import { Outlet } from 'react-router-dom'

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
  const [data, setData] = useState(() => [...products])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    InitColumns || initialTableHeaders
  )
  const navigate = useNavigate()
  const location = useLocation()

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
    navigate(`/products/${currentTarget.id}`)
  }

  return (
    <Card>
      {location.pathname != '/products' && location.pathname != '/' && (
        <Modal onClose={() => navigate('/products')}>
          <Outlet context={[setData]} />
        </Modal>
      )}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Product List</h2>
        <CheckboxDropdown options={table.getAllColumns()} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-primary/70 text-white text-left">
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
                className={`border-b hover:bg-primary/30 cursor-pointer`}
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
          className="bg-primary hover:bg-primary/80 text-white font-regular my-4 py-1 px-4 rounded shadow-md focus:outline-none focus:shadow-outline"
          onClick={() => {
            navigate('/products/add-product')
          }}
        >
          Add Product
        </button>
      </div>
    </Card>
  )
}
interface loaderData {
  allProducts: Product[]
}

const ProductPage: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)

  if (error) {
    notify({ error: error.message })
    return <div>Can't display page</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList products={loaderData.allProducts} />
    </div>
  )
}

export default ProductPage
