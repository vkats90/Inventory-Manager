import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addComponent } from '../actionFunctions'
import { notify } from '../utils/notify'

const AddComponent: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const formData = new FormData(document.querySelector('form') as HTMLFormElement)
    const name = formData.get('name') as string
    const stock = parseInt(formData.get('stock') as string)
    const cost = parseFloat(formData.get('cost') as string)

    try {
      await addComponent(name, cost, stock)
      notify({ success: 'Component added successfully' })
      navigate('/parts', { replace: true })
    } catch (error) {
      notify({ error: 'Failed to add component' })
    }
  }

  return (
    <div className="add-component">
      <h2 className="text-xl font-bold mb-4">Add a new part</h2>

      <form>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="cost">
            Cost:
          </label>
          <input
            type="text"
            name="cost"
            id="cost"
            className="shadow appearance-none border rounded  py-2 px-3 w-60 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="stock">
            Stock:
          </label>
          <input
            type="text"
            name="stock"
            id="stock"
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary shadow-md hover:bg-primary/80 text-white font-bold py-2 px-4 my-2 rounded focus:outline-primary focus:shadow-outline"
          >
            Add Component
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddComponent
