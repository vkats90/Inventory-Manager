import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Order } from '../types'
import isEqual from 'react-fast-compare'
import { notify } from '../utils/notify'
import { verifyDelete } from '../utils/notify'
import { deleteOrder, editOrder } from '../actionFunctions'

const SingleOrderPage: React.FC = () => {
  const { data: loaderOrder } = useLoaderData() as { data: Order }
  const [order, setOrder] = useState<Order>(loaderOrder)
  const [visible, setVisible] = useState(false)

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      const res = await deleteOrder(order.id)
      if (res) {
        notify({ success: 'Order deleted successfully' })
        navigate('/orders', { state: { refresh: true } })
      }
    } catch (error) {
      notify({ error: 'Error while deleting order' })
    }
  }

  const handleSubmit = async () => {
    try {
      const res = await editOrder(
        order.id,
        order.name,
        order.quantity,
        order.priority,
        order.status
      )
      if (isEqual({ ...res, updated_on: '' }, { ...order, updated_on: '' })) {
        setVisible(false)
        notify({ success: 'Order edited successfully' })
      }
    } catch (error) {
      notify({ error: 'Error while editing order' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVisible(true)
    const { name, value } = e.target
    setOrder((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'priority' ? parseInt(value) : value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* @ts-ignore this is a react 19 feature*/}
      <form action={handleSubmit}>
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
              <option value="Created">Created</option>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Finished">Finished</option>
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
        {visible && (
          <button
            className="w-full bg-gray-800 mt-4 text-white rounded px-3 py-2 hover:bg-slate-600 trnsition"
            type="submit"
          >
            Save
          </button>
        )}
      </form>
      <button
        className=" absolute bottom-4 right-4 w-fit bg-red-600 hover:bg-red-700 mt-4 text-white rounded px-2 py-1"
        onClick={() => verifyDelete(handleDelete)}
      >
        Delete
      </button>
    </div>
  )
}

export default SingleOrderPage
