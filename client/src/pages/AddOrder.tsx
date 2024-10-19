import React, { useEffect, useState, SetStateAction } from 'react'
import { Order, Component, Product } from '../types'
import {
  useSubmit,
  Form,
  useOutletContext,
  useActionData,
  useNavigate,
  useLoaderData,
} from 'react-router-dom'
import SearchProductsComponents from '@/components/search-products'
import { useReadQuery, QueryRef } from '@apollo/client'
import { notify } from '../utils/notify'

interface actionDataResponse {
  addOrder: Order & { __typename: string }
}

interface loaderData {
  allComponents: Component[]
  allProducts: Product[]
}

interface Item {
  id: string
  name: string
  stock: number
  type: 'product' | 'component'
  quantity?: number
}

const AddOrder: React.FC = () => {
  const submit = useSubmit()
  const navigate = useNavigate()
  const queryRef = useLoaderData()
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  let actionData = useActionData() as actionDataResponse
  const [setData]: [React.Dispatch<React.SetStateAction<Order[]>>] = useOutletContext()

  useEffect(() => {
    if (error && error.graphQLErrors[0].extensions.code === 'UNAUTHORIZED') {
      notify({ error: 'You have to sign in to view this page' })
      navigate('/login')
    }
  }, [error])

  const handleqtyChange = (e: any) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id == e.target.id) {
          return { ...item, quantity: e.target.value }
        }
        return item
      })
    )
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const items = selectedItems.map((item) => {
      return {
        item: item.id,
        quantity: item.quantity,
        itemType: item.type == 'product' ? 'ProductModel' : 'ComponentModel',
      }
    })
    submit(
      { supplier: e.currentTarget.supplier.value, items: JSON.stringify(items) },
      { method: 'post' }
    )
  }

  useEffect(() => {
    if (actionData && actionData.addOrder.__typename == 'Order') {
      setData((prev: Order[]) => [...prev, actionData.addOrder])
      navigate('/orders')
    }
  }, [actionData, submit])

  return (
    <div className="add-order">
      <h2 className="text-xl font-bold mb-4">Add a new order</h2>
      <Form method="post" onSubmit={handleSubmit}>
        <div className="mb-2 flex items-center align-middle justify-between">
          <SearchProductsComponents
            products={loaderData.allProducts}
            components={loaderData.allComponents}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>

        <div className="flex items-center align-middle justify-between">
          <ul className="grid grid-cols-2 gap-1 w-full">
            {selectedItems.map((item) => (
              <li
                key={item.id}
                className="bg-gray-200 px-2 py-1 rounded flex hover:bg-red-300 transition duration-1000 cursor-pointer"
              >
                <p
                  onClick={() =>
                    setSelectedItems(
                      selectedItems.filter((i) => i.id != item.id) as SetStateAction<Item[]>
                    )
                  }
                >
                  {item.name}
                </p>
                <div className="flex-grow" />
                <input
                  id={item.id}
                  className="w-16 ml-2 px-1 rounded-sm"
                  placeholder="qty"
                  type="number"
                  onChange={handleqtyChange}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="supplier">
            Supplier:
          </label>
          <input
            type="text"
            name="supplier"
            id="supplier"
            className="shadow border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="priority">
            Priority:
          </label>
          <select
            name="priority"
            id="priority"
            className="shadow border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary shadow-md hover:bg-primary/80 text-white font-bold py-2 px-4 my-2 rounded focus:outline-primary focus:shadow-outline"
          >
            Add Order
          </button>
        </div>
      </Form>
    </div>
  )
}

export default AddOrder
