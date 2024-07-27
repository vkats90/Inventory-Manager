import React, { useState } from 'react'
import Card from '../components/card'
import { useNavigate } from 'react-router-dom'
import { Order } from '../types'
import { exampleOrders } from '../assets/data/data'
import CheckboxDropdown from '../components/filter'

function getOrderCellContent(field: string, order: Order): React.ReactNode {
  switch (field) {
    case 'Name':
      return order.name
    case 'Quantity':
      return order.quantity
    case 'Priority':
      return order.priority ?? 'N/A'
    case 'Status':
      return order.status ?? 'N/A'
    case 'Created On':
      return new Date(order.created_on).toLocaleString()
    case 'Created By':
      return order.created_by.name
    case 'Updated On':
      return new Date(order.updated_on).toLocaleString()
    case 'Updated By':
      return order.updated_by?.name ?? 'N/A'
    default:
      return 'Invalid field'
  }
}

export const OrderList: React.FC<{ orders: Order[]; InitColumns?: string[] }> = ({
  orders,
  InitColumns,
}) => {
  const initialTableHeaders = [
    'Name',
    'Quantity',
    'Priority',
    'Status',
    'Created On',
    'Created By',
    'Updated On',
    'Updated By',
  ]
  console.log()
  const [columns, setColumns] = useState(InitColumns || initialTableHeaders)
  const navigate = useNavigate()

  const _handleClick = ({ currentTarget }: React.MouseEvent) => {
    console.log(currentTarget)
    navigate(`/orders/${currentTarget.id}`)
  }

  return (
    <Card>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Order List</h2>
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`border-b hover:bg-slate-200 cursor-pointer ${
                  order.status == 'Finished' ? 'disabled' : ''
                }`}
                id={order.id}
                onClick={_handleClick}
              >
                {columns.map((c) => (
                  <td className="px-4 py-2">{getOrderCellContent(c, order)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

const OrderPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderList orders={exampleOrders} />
    </div>
  )
}

export default OrderPage
