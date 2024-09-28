import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '@/App'
import { Component } from '../types'
import { useLoaderData } from 'react-router-dom'
import { notify } from '../utils/notify'
import { Product } from '../types'
import SelectComponent from '../components/selectComponent'
import { useReadQuery, QueryRef } from '@apollo/client'
import { useSubmit, Form, useActionData, useNavigate, useOutletContext } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface loaderData {
  allComponents: Component[]
}
interface actionDataResponse {
  addProduct: Product & { __typename: string }
}

const AddProduct: React.FC = () => {
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const [components, setComponents] = useState<Component[]>([])
  const { location } = useContext(AppContext)
  const submit = useSubmit()
  const navigate = useNavigate()
  let actionData = useActionData() as actionDataResponse
  const [setData]: [React.Dispatch<React.SetStateAction<Product[]>>] = useOutletContext()

  useEffect(() => {
    console.log(actionData)
    if (actionData && actionData.addProduct.__typename == 'Product') {
      setData((prev: Product[]) => [...prev, actionData.addProduct])
      navigate('/products')
    }
  }, [actionData, submit])

  if (error) {
    notify({ error: error.message })
    return <div>Can't display page</div>
  }

  return (
    <div className="add-product">
      <h2 className="text-xl font-bold mb-4">Add a new product</h2>
      <Form
        method="post"
        onSubmit={(event) => {
          event.preventDefault()
          submit(
            {
              // @ts-ignore
              name: event.currentTarget.name.value,
              cost: event.currentTarget.cost.value,
              stock: event.currentTarget.stock.value,
              price: event.currentTarget.price.value,
              SKU: event.currentTarget.SKU.value,
              components: JSON.stringify(components),
            },
            { method: 'post' }
          )
        }}
      >
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
        <TooltipProvider>
          <Tooltip>
            <div className="mb-4 gap-4 flex items-center align-middle justify-between">
              <label className="block font-semibold mb-2 " htmlFor="location">
                Location:
              </label>
              <TooltipTrigger>
                <input
                  type="text"
                  value={location?.name}
                  name="location"
                  id="location"
                  className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-primary focus:shadow-outline"
                  disabled
                />
              </TooltipTrigger>
            </div>
            <TooltipContent>
              <p>To add in a different location, change to that location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SelectComponent
          selectedParts={[]}
          allParts={loaderData.allComponents}
          callback={(newComponent) => setComponents(newComponent)}
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary shadow-md hover:bg-primary/80 text-white font-bold py-2 px-4 my-2 rounded focus:outline-primary focus:shadow-outline"
          >
            Add Product
          </button>
        </div>
      </Form>
    </div>
  )
}

export default AddProduct
