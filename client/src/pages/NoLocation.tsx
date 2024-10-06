import React from 'react'
import { Link } from 'react-router-dom'
import { Map } from 'lucide-react'

const NoLocation: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="relative mx-auto w-1/4 my-auto p-4 mt-[20%] bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col items-center">
          <Map className="h-1/4 w-1/4 text-red-500 mt-0.5" />
          <h1 className="text-2xl font-bold text-Ubuntu text-center">
            You have no inventory locations
          </h1>

          <Link
            to="/create-location"
            className="w-fit bg-primary mt-8 text-white rounded px-3 py-2 hover:bg-primary/70"
          >
            Create Location
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NoLocation
