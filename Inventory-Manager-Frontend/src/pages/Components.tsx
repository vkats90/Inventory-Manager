import React, { useState, useEffect } from 'react'
import Card from '../components/card'
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom'
import { Component } from '../types'
import Modal from '../components/modal'
import { Outlet } from 'react-router-dom'
import { useReadQuery, QueryRef } from '@apollo/client'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from '@tanstack/react-table'

import CheckboxDropdown from '../components/filter'
import { notify } from '../utils/notify'

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
  const [data, setData] = useState(() => [...components])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    InitColumns || initialPartHeaders
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
    navigate(`/parts/${currentTarget.id}`)
  }
  return (
    <Card>
      {location.pathname != '/parts' && location.pathname != '/' && (
        <Modal onClose={() => navigate('/parts')}>
          <Outlet context={[setData]} />
        </Modal>
      )}
      <div className="flex justify-between">
        <h2 className="text-2xl mb-4">Part List</h2>
        <CheckboxDropdown options={table.getAllColumns()} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-primary/70 text-left text-white ">
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
                className={`border-b  hover:bg-primary/30 cursor-pointer`}
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
  allComponents: Component[]
}

const ComponentPage: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('error', error)
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
      <ComponentList components={loaderData.allComponents} />
    </div>
  )
}

export default ComponentPage
