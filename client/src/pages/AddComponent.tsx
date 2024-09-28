import React, { useEffect, useContext } from 'react'
import { AppContext } from '@/App'
import { Component } from '@/types'
import { useSubmit, Form, useOutletContext, useActionData, useNavigate } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface actionDataResponse {
  addComponent: Component & { __typename: string }
}

const AddComponent: React.FC = () => {
  let submit = useSubmit()
  const navigate = useNavigate()
  let actionData = useActionData() as actionDataResponse

  const [setData]: [React.Dispatch<React.SetStateAction<Component[]>>] = useOutletContext()
  const { location } = useContext(AppContext)

  useEffect(() => {
    if (actionData && actionData.addComponent.__typename == 'Component') {
      setData((prev: Component[]) => [...prev, actionData.addComponent])
      navigate('/parts')
    }
  }, [actionData, submit])

  return (
    <div className="add-component">
      <h2 className="text-xl font-bold mb-4">Add a new part</h2>

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
            required
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <div className="mb-4 gap-4 flex items-center align-middle justify-between">
              <label className="block text-gray-700 text-lg font-medium mb-2  " htmlFor="location">
                Location:
              </label>
              <TooltipTrigger>
                <input
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

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary shadow-md hover:bg-primary/80 text-white font-bold py-2 px-4 my-2 rounded focus:outline-primary focus:shadow-outline"
          >
            Add Component
          </button>
        </div>
      </Form>
    </div>
  )
}

export default AddComponent
