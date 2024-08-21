import React, { useEffect } from 'react'
import { Order } from '../types'
import { useSubmit, Form, useOutletContext, useActionData, useNavigate } from 'react-router-dom'

interface actionDataResponse {
  addOrder: Order & { __typename: string }
}

const AddOrder: React.FC = () => {
  const submit = useSubmit()
  const navigate = useNavigate()
  let actionData = useActionData() as actionDataResponse

  const [setData]: [React.Dispatch<React.SetStateAction<Order[]>>] = useOutletContext()

  useEffect(() => {
    if (actionData && actionData.addOrder.__typename == 'Order') {
      setData((prev: Order[]) => [...prev, actionData.addOrder])
      navigate('/orders')
    }
  }, [actionData, submit])

  return (
    <div className="add-order">
      <h2 className="text-xl font-bold mb-4">Add a new order</h2>
      <Form
        method="post"
        onSubmit={(event) => {
          event.preventDefault()
          submit(event.currentTarget)
        }}
      >
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="quantity">
            Quantity:
          </label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            className="shadow appearance-none border rounded  py-2 px-3 w-60 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
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
