import React, { useState } from 'react'
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import { Order } from '../types'
import isEqual from 'react-fast-compare'
import { notify } from '../utils/notify'
import { verifyDelete } from '../utils/notify'
import { deleteOrder, editOrder } from '../actionFunctions'
import { useReadQuery, QueryRef } from '@apollo/client'

interface loaderData {
  findOrder: Order
}

const SingleOrderPage: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderOrder, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const [order, setOrder] = useState<Order>(loaderOrder.findOrder)
  const [visible, setVisible] = useState(false)
  const [setData]: [React.Dispatch<React.SetStateAction<Order[]>>] = useOutletContext()

  if (error) {
    notify({ error: error.message })
    return <div>Can't display page</div>
  }

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      const res = await deleteOrder(order.id)
      if (res) {
        notify({ success: 'Order deleted successfully' })
        setData((prev: Order[]) => {
          return prev.filter((o) => o.id !== order.id)
        })
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
        navigate('/orders')
        setData((prev: Order[]) => {
          return prev.map((o) => (o.id === order.id ? res : o))
        })
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
      <form>
        <input
          className="text-3xl font-bold mb-4 w-full focus:outline-primary"
          value={order.name}
          onChange={handleInputChange}
          name="name"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Quantity:</label>
            <input
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              type="number"
              value={order.quantity}
              onChange={handleInputChange}
              name="quantity"
            />
          </div>
          <div>
            <label className="font-semibold ">Priority:</label>

            <select
              name="priority"
              id="priority"
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              value={order.priority ?? ''}
              onChange={handleInputChange}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Status:</label>
            <select
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              value={order.status ?? ''}
              onChange={handleInputChange}
              name="status"
            >
              <option value="Created">Created</option>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Created On:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100 focus:outline-primary"
              value={new Date(Number(order.created_on)).toLocaleString()}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Created By:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100 focus:outline-primary"
              value={order.created_by.name}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Updated On:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100 focus:outline-primary"
              value={new Date(Number(order.updated_on)).toLocaleString()}
              readOnly
            />
          </div>
          <div>
            <label className="font-semibold">Updated By:</label>
            <input
              className="w-full mt-1 p-2 border rounded bg-gray-100 focus:outline-primary"
              value={order.updated_by?.name ?? 'N/A'}
              readOnly
            />
          </div>
        </div>
        {visible && (
          <button
            className="w-full bg-gray-800 mt-4 text-white rounded px-3 py-2 hover:bg-slate-600 trnsition"
            type="button"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </form>
      <button
        className=" absolute bottom-4 right-4 w-fit bg-red-600 hover:bg-red-700 mt-4 text-white rounded px-1 py-1 shadow-sm shadow-gray-600"
        onClick={() => verifyDelete(handleDelete)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-white"
        >
          <path d="m17,4v-2c0-1.103-.897-2-2-2h-6c-1.103,0-2,.897-2,2v2H1v2h1.644l1.703,15.331c.169,1.521,1.451,2.669,2.982,2.669h9.304c1.531,0,2.813-1.147,2.981-2.669l1.703-15.331h1.682v-2h-6Zm-8-2h6v2h-6v-2Zm6.957,14.543l-1.414,1.414-2.543-2.543-2.543,2.543-1.414-1.414,2.543-2.543-2.543-2.543,1.414-1.414,2.543,2.543,2.543-2.543,1.414,1.414-2.543,2.543,2.543,2.543Z" />
        </svg>
      </button>
    </div>
  )
}

export default SingleOrderPage
