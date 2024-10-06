import React, { useState, useEffect, Component } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom'
import { Product } from '../types'
import { ComparisonOperator } from '../utils/compare'
import { useReadQuery, QueryRef } from '@apollo/client'
import { compareNumbers } from '@/utils/compare'
import { notify } from '../utils/notify'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

//import { exampleProducts } from '../assets/data/data'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import SearchWithColumnFilter from '../components/search-with-column-filter'
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

export const ProductList: React.FC<{
  products: Product[]
  InitColumns?: typeof initialTableHeaders
}> = ({ products, InitColumns }) => {
  const [data, setData] = useState(() => [...products])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    InitColumns || initialTableHeaders
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [operator, setOperator] = useState<ComparisonOperator>('eq')

  const navigate = useNavigate()
  const location = useLocation()

  const defaultColumns = [
    columnHelper.accessor('image', {
      header: '',
      meta: { headerClassName: 'w-16' },
      cell: () => (
        <div className="border-2 rounded-sm w-8 h-8 flex justify-center align-middle pt-1 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            fill="lightgray"
            width="80%"
            height="80%"
          >
            <path d="M9,7.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Zm15-.5v6c0,2.76-2.24,5-5,5H10c-2.76,0-5-2.24-5-5V7c0-2.76,2.24-5,5-5h9c2.76,0,5,2.24,5,5ZM7,13c0,.77,.29,1.47,.77,2.01l5.24-5.24c.98-.98,2.69-.98,3.67,0l1.04,1.04c.23,.23,.62,.23,.85,0l3.43-3.43v-.38c0-1.65-1.35-3-3-3H10c-1.65,0-3,1.35-3,3v6Zm15,0v-2.79l-2.02,2.02c-.98,.98-2.69,.98-3.67,0l-1.04-1.04c-.23-.23-.61-.23-.85,0l-4.79,4.79c.12,.02,.24,.02,.37,.02h9c1.65,0,3-1.35,3-3Zm-5,7H5c-1.65,0-3-1.35-3-3v-6c0-.74,.27-1.45,.77-2,.37-.41,.33-1.04-.08-1.41-.41-.37-1.04-.33-1.41,.08-.82,.92-1.28,2.1-1.28,3.34v6c0,2.76,2.24,5,5,5h12c.55,0,1-.45,1-1s-.45-1-1-1Z" />
          </svg>
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: 'ID',
      cell: (info) => info.getValue(),
      enableHiding: false,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
    }),
    columnHelper.accessor('stock', {
      header: 'Stock',
      cell: (info) => info.getValue(),
      filterFn: (row, id, value) => compareNumbers(row.getValue(id) as number, value, operator),
    }),
    columnHelper.accessor('cost', {
      header: 'Cost',
      cell: (info) => info.getValue(),
      filterFn: (row, id, value) => compareNumbers(row.getValue(id) as number, value, operator),
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => info.getValue(),
      filterFn: (row, id, value) => compareNumbers(row.getValue(id) as number, value, operator),
    }),
    columnHelper.accessor('SKU', {
      header: 'SKU',
      cell: (info) => info.getValue(),
      filterFn: 'includesString',
    }),
    columnHelper.accessor('components', {
      header: 'Components',
      filterFn: (row, id, value) => {
        const components: Component[] = row.getValue(id)
        return components.some((c: any) =>
          c.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        )
      },
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
        <div className="overflow-x-auto ">
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
                  className={`border-b hover:bg-gradient-to-r hover:from-primary/30 hover:to-white cursor-pointer `}
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
        <div className="text-center text-lg font-medium text-gray-500 my-8">No products yet</div>
      )}
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
      <ProductList products={loaderData.allProducts} />
    </div>
  )
}

export default ProductPage
