import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate } from 'react-router-dom'
import { Product } from '../types'
import { exampleProducts } from '../assets/data/data'
import CheckboxDropdown from '../components/filter'

const initialTableHeaders: string[] = ['Name', 'Stock', 'Cost', 'Price', 'SKU', 'Parts']

function getProductCellContent(field: string, product: Product): React.ReactNode {
  switch (field) {
    case 'Name':
      return product.name
    case 'Stock':
      return product.stock
    case 'Cost':
      return product.cost !== null ? `$${product.cost.toFixed(2)}` : 'N/A'
    case 'Price':
      return product.price !== null ? `$${product.price.toFixed(2)}` : 'N/A'
    case 'SKU':
      return product.SKU
    case 'Components':
      return product.components ? product.components.map((c) => c.name).join(', ') : 'None'
    default:
      return 'Invalid field'
  }
}

export const ProductList: React.FC<{ products: Product[]; InitColumns?: string[] }> = ({
  products,
  InitColumns,
}) => {
  const [columns, setColumns] = useState(InitColumns || initialTableHeaders)
  const navigate = useNavigate()

  const _handleClick = ({ currentTarget }: React.MouseEvent) => {
    console.log(currentTarget)
    navigate(`/products/${currentTarget.id}`)
  }

  return (
    <Card>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Product List</h2>
        <CheckboxDropdown
          options={initialTableHeaders}
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
            {products.map((product) => (
              <tr
                key={product.id}
                id={product.id}
                className="border-b hover:bg-slate-200 cursor-pointer"
                onClick={_handleClick}
              >
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2">
                    {getProductCellContent(column, product)}
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

const ProductPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList products={exampleProducts} />
    </div>
  )
}

export default ProductPage
