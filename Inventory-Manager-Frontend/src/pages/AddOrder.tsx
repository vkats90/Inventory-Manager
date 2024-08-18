import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addOrder } from '../actionFunctions'
import { notify } from '../utils/notify'

const AddOrder: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const formData = new FormData(document.querySelector('form') as HTMLFormElement)
    const name = formData.get('name') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const priority = parseInt(formData.get('priority') as string)

    try {
      await addOrder(name, quantity, priority, 'created')
      notify({ success: 'Order added successfully' })
      navigate('/orders')
    } catch (error) {
      notify({ error: 'Failed to add order' })
    }
  }

  return (
    <div className="add-order">
      <h2 className="text-xl font-bold mb-4">Add a new order</h2>
      {/* @ts-ignore this is a react 19 feature*/}
      <form>
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
            type="button"
            onClick={handleSubmit}
            className="bg-primary shadow-md hover:bg-primary/80 text-white font-bold py-2 px-4 my-2 rounded focus:outline-primary focus:shadow-outline"
          >
            Add Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddOrder
