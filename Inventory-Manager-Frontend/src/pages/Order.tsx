import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import Card from '../components/card'
import { Order } from '../types'

const SingleOrderPage: React.FC = () => {
  const { data: loaderOrder } = useLoaderData() as { data: Order }
  const [order, setOrder] = useState<Order>(loaderOrder)
  console.log(new Date(Number(loaderOrder.created_on)).toLocaleDateString())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOrder((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'priority' ? parseInt(value) : value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <input
          className="text-3xl font-bold mb-4 w-full"
          value={order.name}
          onChange={handleInputChange}
          name="name"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Quantity:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              type="number"
              value={order.quantity}
              onChange={handleInputChange}
              name="quantity"
            />
          </div>
          <div>
            <label className="font-semibold">Priority:</label>
            <input
              className="w-full mt-1 p-2 border rounded"
              type="number"
              value={order.priority ?? ''}
              onChange={handleInputChange}
              name="priority"
            />
          </div>
          <div>
            <label className="font-semibold">Status:</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={order.status ?? ''}
              onChange={handleInputChange}
              name="status"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Created On:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100"
              value={new Date(Number(order.created_on)).toLocaleString()}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Created By:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100"
              value={order.created_by.name}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Updated On:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100"
              value={new Date(Number(order.updated_on)).toLocaleString()}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Updated By:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100"
              value={order.updated_by?.name ?? 'N/A'}
              readOnly
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SingleOrderPage
