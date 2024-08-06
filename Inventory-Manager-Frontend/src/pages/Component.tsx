import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import Card from '../components/card'
import { Component } from '../types'
import { editComponent, deleteComponent } from '../actionFunctions'
import isEqual from 'react-fast-compare'
import { notify, verifyDelete } from '../utils/notify'

interface loaderData {
  data: Component
}

const SingleComponentPage: React.FC = () => {
  const navigate = useNavigate()
  let { data: loaderComponent } = useLoaderData() as loaderData
  const [component, setComponent] = useState<Component>(loaderComponent)
  const [visible, setVisible] = useState(false)

  const handleDelete = async () => {
    try {
      const res = await deleteComponent(component.name)
      if (res) {
        notify({ success: 'Component deleted successfully' })
        navigate('/parts', { state: { refresh: true } })
      }
    } catch (error) {
      notify({ error: 'Error while deleting component' })
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisible(true)
    const { name, value } = e.target
    setComponent((prev) => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) : name === 'cost' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      const res = await editComponent(
        component.id,
        component.name,
        component.cost ? component.cost : 0,
        component.stock
      )
      if (isEqual(res, component)) {
        setVisible(false)
        notify({ success: 'Component edited successfully' })
      }
    } catch (error) {
      notify({ error: 'Error while editing component' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        {/* @ts-ignore this is a react 19 feature*/}
        <form action={handleSubmit}>
          <input
            className="text-3xl font-bold mb-4 w-full"
            name="name"
            value={component.name}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">ID:</label>
              <input
                className="w-full mt-1 p-2 border rounded bg-gray-100"
                readOnly
                value={component.id}
              />
            </div>
            <div>
              <label className="font-semibold">Stock:</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                type="number"
                step="1"
                value={component.stock}
                onChange={handleInputChange}
                name="stock"
              />
            </div>
            <div>
              <label className="font-semibold">Cost:</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                type="number"
                step="0.01"
                value={component.cost ?? ''}
                onChange={handleInputChange}
                name="cost"
              />
            </div>
          </div>
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
          className=" absolute top-2 right-4 w-fit bg-red-600 hover:bg-red-700 mt-4 text-white rounded px-2 py-1"
          onClick={() => verifyDelete(handleDelete)}
        >
          Delete
        </button>
      </Card>
    </div>
  )
}

export default SingleComponentPage
