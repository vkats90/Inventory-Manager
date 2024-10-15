import React, { useState, useContext } from 'react'
import { AppContext } from '../App'
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Order } from '../types'
import isEqual from 'react-fast-compare'
import { notify } from '../utils/notify'
import { verifyDelete } from '../utils/notify'
import { deleteOrder, editOrder } from '../actionFunctions'
import { useReadQuery, QueryRef } from '@apollo/client'
import { ImagePlus, Trash2 } from 'lucide-react'

interface loaderData {
  findOrder: Order
}

const SingleOrderPage: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderOrder, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const { location, allLocations } = useContext(AppContext)
  const [order, setOrder] = useState<Order>({
    ...loaderOrder.findOrder,
    location: location?.id || '',
  })
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
        order.priority,
        order.status,
        order.supplier,
        order.location as string
      )
      console.log(res, order)
      if (location?.id != res.location.id) {
        notify({ success: 'Order succesfully moved to the ' + res.location.name + ' location' })
        setData((prev: Order[]) => {
          return prev.filter((c) => c.id !== order.id)
        })
        navigate('/orders')
      } else if (
        (console.log(res.items, order.items),
        isEqual(
          { ...res, updated_on: '', location: '' },
          { ...order, updated_on: '', location: '' }
        ))
      ) {
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

  const handleDeleteItem = (index: number) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index) as Order['items'],
    }))
    setVisible(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form>
        <div className="rounded-md mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        handleDeleteItem(index)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete item</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="font-semibold">Supplier:</label>
            <input
              id="supplier"
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              type="text"
              value={order.supplier}
              onChange={handleInputChange}
              name="supplier"
            />
          </div>
          <div>
            <label className="font-semibold">Location:</label>
            <select
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              value={order.location as string}
              onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
              name="location"
            >
              {allLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
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
        className=" absolute bottom-4 right-4 w-fit mt-4 text-red-500 hover:text-red-300 hover:scale-105 rounded px-1 py-1 shadow-sm shadow-gray-600"
        onClick={() => verifyDelete(handleDelete)}
      >
        <Trash2 className="h-6 w-6 " />
      </button>
    </div>
  )
}

export default SingleOrderPage
