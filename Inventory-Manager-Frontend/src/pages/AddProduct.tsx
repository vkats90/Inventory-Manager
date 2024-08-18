import React, { useState } from 'react'
import { Component } from '../types'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { addProduct } from '../actionFunctions'
import { notify } from '../utils/notify'
import SelectComponent from '../components/selectComponent'
import { useReadQuery, QueryRef } from '@apollo/client'

interface loaderData {
  allComponents: Component[]
}

const AddProduct: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const [components, setComponents] = useState<Component[]>([])
  const navigate = useNavigate()

  if (error) {
    notify({ error: error.message })
    return <div>Can't display page</div>
  }

  const handleSubmit = async () => {
    const formData = new FormData(document.querySelector('form') as HTMLFormElement)
    const name = formData.get('name') as string
    const stock = parseInt(formData.get('stock') as string)
    const cost = parseFloat(formData.get('cost') as string)
    const price = parseFloat(formData.get('price') as string)
    const SKU = formData.get('SKU') as string

    try {
      await addProduct(name, cost, stock, price, SKU, components)
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
      <form>
        <div className="mb-4 gap-4 flex items-center align-middle justify-between">
          <label className="block font-semibold mb-2 " htmlFor="name">
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
          <label className="block font-semibold mb-2 " htmlFor="cost">
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
          <label className="block font-semibold mb-2 " htmlFor="stock">
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
          <label className="block font-semibold mb-2 " htmlFor="price">
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
          <label className="block font-semibold mb-2 " htmlFor="SKU">
            SKU:
          </label>
          <input
            type="text"
            name="SKU"
            id="SKU"
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
          />
        </div>
        <SelectComponent
          selectedParts={[]}
          allParts={loaderData.allComponents}
          callback={(newComponent) => setComponents(newComponent)}
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
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
