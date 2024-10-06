import React, { useState, useContext } from 'react'
import { AppContext } from '../App'
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import { Component } from '../types'
import { editComponent, deleteComponent } from '../actionFunctions'
import isEqual from 'react-fast-compare'
import { notify, verifyDelete } from '../utils/notify'
import { useReadQuery, QueryRef } from '@apollo/client'
import { Trash2 } from 'lucide-react'

interface loaderData {
  findComponent: Component
}

const SingleComponentPage: React.FC = () => {
  const queryRef = useLoaderData()
  const { location, allLocations } = useContext(AppContext)
  const { data: loaderComponent, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const [component, setComponent] = useState<Component>({
    ...loaderComponent.findComponent,
    location: location?.id || '',
  })
  const [visible, setVisible] = useState(false)
  const [setData]: [React.Dispatch<React.SetStateAction<Component[]>>] = useOutletContext()

  if (error) {
    notify({ error: error.message })
    return <div>Can't display page</div>
  }

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      const res = await deleteComponent(component.name)
      if (res) {
        notify({ success: 'Component deleted successfully' })
        setData((prev: Component[]) => {
          return prev.filter((c) => c.id !== component.id)
        })
        navigate('/parts')
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
      [name]: name === 'stock' ? Number(value) : name === 'cost' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      const res = await editComponent(
        component.id,
        component.name,
        component.cost ? component.cost : 0,
        component.stock,
        component.location as string
      )

      if (location?.id != res.location.id) {
        notify({ success: 'Component succesfully moved to the ' + res.location.name + ' location' })
        setData((prev: Component[]) => {
          return prev.filter((c) => c.id !== component.id)
        })
        navigate('/parts')
      } else if (isEqual({ ...res, location: res.location.id }, component)) {
        setVisible(false)
        notify({ success: 'Component edited successfully' })
        setData((prev: Component[]) => {
          return prev.map((c) => (c.id === component.id ? component : c))
        })
        navigate('/parts')
      }
    } catch (error) {
      notify({ error: 'Error while editing component' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form>
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
              className="w-full mt-1 p-2 border rounded bg-gray-100 focus:outline-primary"
              readOnly
              value={component.id}
            />
          </div>
          <div>
            <label className="font-semibold">Stock:</label>
            <input
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
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
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              type="number"
              step="0.01"
              value={component.cost ?? ''}
              onChange={handleInputChange}
              name="cost"
            />
          </div>
          <div>
            <label className="font-semibold">Location:</label>
            <select
              className="w-full mt-1 p-2 border rounded focus:outline-primary"
              value={component.location as string}
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
        className=" absolute bottom-4 right-4 w-fit mt-4 text-red-500 hover:text-red-300 hover:scale-105 rounded px-1 py-1 shadow-sm shadow-gray-600"
        onClick={() => verifyDelete(handleDelete)}
      >
        <Trash2 className="h-6 w-6 " />
      </button>
    </div>
  )
}

export default SingleComponentPage
