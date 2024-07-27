import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate } from 'react-router-dom'
import { Component } from '../types'
import { exampleComponents } from '../assets/data/data'
import CheckboxDropdown from '../components/filter'

const initialPartHeaders = ['Name', 'Stock', 'Cost']

function getPartCellContent(field: string, part: Component): React.ReactNode {
  switch (field) {
    case 'Name':
      return part.name
    case 'Stock':
      return part.stock
    case 'Cost':
    default:
      return 'Invalid field'
  }
}

// ComponentList component
export const ComponentList: React.FC<{ components: Component[]; InitColumns?: string[] }> = ({
  components,
  InitColumns,
}) => {
  const [columns, setColumns] = useState(InitColumns || initialPartHeaders)
  const navigate = useNavigate()

  const _handleClick = ({ currentTarget }: React.MouseEvent) => {
    console.log(currentTarget)
    navigate(`/parts/${currentTarget.id}`)
  }
  return (
    <Card>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Part List</h2>
        <CheckboxDropdown
          options={initialPartHeaders}
          onFilterChange={setColumns}
          selected={columns}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              {columns.map((c) => (
                <th className="px-4 py-2">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr
                key={component.id}
                id={component.id}
                className="border-b hover:bg-slate-200 cursor-pointer"
                onClick={_handleClick}
              >
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2">
                    {getPartCellContent(column, component)}
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
