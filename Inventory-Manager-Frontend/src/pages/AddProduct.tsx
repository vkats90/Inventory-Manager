import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addProduct } from '../actionFunctions'
import { notify } from '../utils/notify'

const AddProduct: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name') as string
    const stock = parseInt(formData.get('stock') as string)
    const cost = parseFloat(formData.get('cost') as string)
    const price = parseFloat(formData.get('price') as string)
    const SKU = formData.get('SKU') as string

    try {
      await addProduct(name, cost, stock, price, SKU, [])
      notify({ success: 'Product added successfully' })
      navigate('/products')
    } catch (error) {
      notify({ error: 'Failed to add product' })
    }
  }

  return (
    <div className="add-product">
      <h2 className="text-xl font-bold mb-4">Add a new product</h2>
      {/* @ts-ignore this is a react 19 feature*/}
      <form action={handleSubmit}>
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
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="price">
            Price:
          </label>
          <input
            type="text"
            name="price"
            id="price"
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
          />
        </div>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block text-gray-700 text-lg font-medium mb-2 " htmlFor="SKU">
            SKU:
          </label>
          <input
            type="text"
            name="SKU"
            id="SKU"
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary shadow-md hover:bg-primary/80 text-white font-bold py-2 px-4 my-2 rounded focus:outline-primary focus:shadow-outline"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
