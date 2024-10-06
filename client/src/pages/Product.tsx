import React, { useState, useContext } from 'react'
import { AppContext } from '../App'
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import { Product, Component } from '../types'
import isEqual from 'react-fast-compare'
import { notify } from '../utils/notify'
import { verifyDelete } from '../utils/notify'
import { deleteProduct, editProduct } from '../actionFunctions'
import { useReadQuery, QueryRef } from '@apollo/client'
import SelectComponent from '../components/selectComponent'

interface loaderData {
  findProduct: Product
  allComponents: Component[]
}

const SingleProductPage: React.FC = () => {
  const { location, allLocations } = useContext(AppContext)
  const queryRef = useLoaderData()
  const { data: loaderProduct, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const [product, setProduct] = useState<Product>({
    ...loaderProduct.findProduct,
    location: location?.id || '',
  })
  const [visible, setVisible] = useState(false)
  const [setData]: [React.Dispatch<React.SetStateAction<Product[]>>] = useOutletContext()

  if (error) {
    notify({ error: error.message })
    return <div>Can't display page</div>
  }

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      const res = await deleteProduct(product.name)
      if (res) {
        notify({ success: 'Product deleted successfully' })
        setData((prev) => {
          return prev.filter((p) => p.id !== product.id)
        })
        navigate('/products')
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
      [name]:
        name === 'stock'
          ? Number(value)
          : name === 'cost'
          ? parseFloat(value)
          : name == 'price'
          ? parseFloat(value)
          : value,
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
        product.components,
        product.location as string
      )
      if (location?.id != res.location.id) {
        console.log('edited location')
        notify({ success: 'Product succesfully moved to the ' + res.location.name + ' location' })
        setData((prev) => {
          return prev.filter((p) => p.id !== product.id)
        })
        navigate('/products')
      } else if (isEqual({ ...res, location: res.location.id }, product)) {
        setVisible(false)
        notify({ success: 'Product edited successfully' })
        setData((prev) => {
          return prev.map((p) => (p.id === product.id ? product : p))
        })
        navigate('/products')
      }
    } catch (error) {
      notify({ error: 'Error while editing product' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form>
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
          <div>
            <label className="font-semibold">Location:</label>
            <select
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              value={product.location as string}
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

        <SelectComponent
          selectedParts={product.components}
          allParts={loaderProduct.allComponents}
          callback={(newComponent) => {
            setVisible(true)
            setProduct((prev) => {
              return { ...prev, components: newComponent }
            })
          }}
        />
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

export default SingleProductPage
