import React from 'react'
import { Link } from 'react-router-dom'

const NoLocation: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="relative mx-auto w-1/4 my-auto p-4 mt-[20%] bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col items-center">
          <svg
            fill="#000000"
            className="w-20 h-20 mb-4"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 237.569 237.569"
          >
            <g>
              <path
                d="M234.362,24.818c-2.009-1.403-4.576-1.736-6.879-0.89l-71.607,26.306L84.272,23.927c-1.671-0.614-3.504-0.614-5.173,0
		L4.914,51.183C1.962,52.268,0,55.079,0,58.223v148.379c0,2.451,1.198,4.748,3.207,6.15c1.276,0.891,2.778,1.35,4.293,1.35
		c0.871,0,1.747-0.152,2.586-0.46l71.599-26.306l71.604,26.306c1.669,0.613,3.502,0.613,5.173,0l74.193-27.256
		c2.952-1.084,4.914-3.895,4.914-7.04V30.968C237.569,28.516,236.372,26.22,234.362,24.818z M222.569,174.112l-66.693,24.5
		l-71.604-26.306c-0.835-0.307-1.711-0.46-2.586-0.46c-0.876,0-1.752,0.153-2.587,0.46L15,195.857V63.458l66.686-24.5l71.604,26.306
		c1.669,0.613,3.502,0.613,5.173,0l64.107-23.551V174.112z"
              />
              <path
                d="M157.018,114.759c0-25.51-20.752-46.264-46.26-46.264c-25.51,0-46.264,20.754-46.264,46.264
		c0,25.509,20.754,46.262,46.264,46.262c10.053,0,19.359-3.233,26.955-8.701l22.563,22.559c1.464,1.464,3.383,2.196,5.303,2.196
		c1.919,0,3.839-0.732,5.304-2.197c2.929-2.929,2.928-7.678-0.001-10.606l-22.562-22.559
		C153.785,134.116,157.018,124.811,157.018,114.759z M79.494,114.759c0-17.239,14.025-31.264,31.264-31.264
		c17.237,0,31.26,14.025,31.26,31.264c0,17.238-14.023,31.262-31.26,31.262C93.519,146.02,79.494,131.996,79.494,114.759z"
              />
            </g>
          </svg>
          <h1 className="text-2xl font-bold text-Ubuntu text-center">
            You have no inventory locations
          </h1>

          <p className="text-center mt-4">Please create your first location</p>
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
