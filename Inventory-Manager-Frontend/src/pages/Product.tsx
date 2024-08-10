import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Product } from '../types'
import isEqual from 'react-fast-compare'
import { notify } from '../utils/notify'
import { verifyDelete } from '../utils/notify'
import { deleteProduct, editProduct } from '../actionFunctions'

const SingleProductPage: React.FC = () => {
  const { data: loaderProduct } = useLoaderData() as { data: Product }
  const [product, setProduct] = useState<Product>(loaderProduct)
  const [visible, setVisible] = useState(false)

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      const res = await deleteProduct(product.name)
      if (res) {
        notify({ success: 'Product deleted successfully' })
        navigate('/products', { state: { refresh: true } })
      }
    } catch (error) {
      notify({ error: 'Error while deleting product' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisible(true)
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) : name === 'cost' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      const res = await editProduct(
        product.id,
        product.name,
        product.cost ? product.cost : 0,
        product.stock,
        product.price ? product.price : 0,
        product.SKU,
        product.components
      )
      if (isEqual(res, product)) {
        setVisible(false)
        notify({ success: 'Product edited successfully' })
      }
    } catch (error) {
      notify({ error: 'Error while editing product' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* @ts-ignore this is a react 19 feature*/}
      <form action={handleSubmit}>
        <input
          className="text-3xl font-bold mb-4 w-full focus:outline-primary"
          value={product.name}
          onChange={handleInputChange}
          name="name"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">SKU:</label>
            <input
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              value={product.SKU}
              onChange={handleInputChange}
              name="SKU"
            />
          </div>
          <div>
            <label className="font-semibold">Stock:</label>
            <input
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              type="number"
              value={product.stock}
              onChange={handleInputChange}
              name="stock"
            />
          </div>
          <div>
            <label className="font-semibold">Cost:</label>
            <input
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              type="number"
              step="0.01"
              value={product.cost ?? ''}
              onChange={handleInputChange}
              name="cost"
            />
          </div>
          <div>
            <label className="font-semibold">Price:</label>
            <input
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              type="number"
              step="0.01"
              value={product.price ?? ''}
              onChange={handleInputChange}
              name="price"
            />
          </div>
        </div>

        {product.components && product.components.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Components:</p>
            <ul className="list-disc list-inside">
              {product.components.map((component, index) => (
                <li key={index}>{component.name}</li>
              ))}
            </ul>
          </div>
        )}
        <form
        //add component logic here using action={}
        >
          <input name="component" className="mr-4 mt-1 p-2 border rounded focus:outline-primary" />
          <button className=" bg-primary mt-4 text-white rounded px-3 py-2 hover:bg-primary/80 trnsition">
            {' '}
            Add Component{' '}
          </button>
        </form>
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

export default SingleProductPage
