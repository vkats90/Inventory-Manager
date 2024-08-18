import React, { Suspense } from 'react'

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white p-6 rounded shadow-lg ">
        <div className="absolute top-2 right-2 justify-end">
          <button
            className=" text-black rounded px-4 py-2 mr-2 hover:rotate-90 transition ease-in-out"
            onClick={onClose}
          >
            <svg className="w-8 h-8 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                fill="#0F1729"
              />
            </svg>
          </button>
        </div>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
    </div>
  )
}

export default Modal
