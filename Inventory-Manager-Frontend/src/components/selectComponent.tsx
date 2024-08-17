import React, { useState } from 'react'
import { Component } from '../types'
import Modal from './modal' // Assuming you have a Modal component

interface SelectComponentProps {
  selectedParts: Component[]
  allParts: Component[]
  callback: (selectedParts: Component[]) => void
}

const SelectComponent: React.FC<SelectComponentProps> = ({ selectedParts, allParts, callback }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredParts, setFilteredParts] = useState<boolean>(false)
  const [selectedPartsState, setSelectedPartsState] = useState<Component[]>(selectedParts)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  /*const handleConfirmModal = () => {
    const newPart: Component = { name: newPartName, description: newPartDescription, stock: 0, cost: 0 };
    const updatedParts = [...selectedPartsState, newPart];
    setSelectedPartsState(updatedParts);
    callback(updatedParts);
    setIsModalOpen(false);
  };*/

  const handleCheckboxChange = (part: Component) => {
    const updatedParts = selectedPartsState.map((x) => x.name).includes(part.name)
      ? selectedPartsState.filter((p) => p.name !== part.name)
      : [...selectedPartsState, part]
    setSelectedPartsState(updatedParts)
  }

  const handleCallback = () => {
    setFilteredParts(false)
    callback(selectedPartsState)
  }

  return (
    <div className="select-component my-4">
      <label className="block  text-md font-bold mb-2" htmlFor="parts">
        Parts
      </label>
      <table className="min-w-full bg-white text-left">
        <thead>
          <tr>
            {filteredParts && <th className="py-2">Select</th>}
            <th className="py-2">Name</th>
            <th className="py-2">Cost</th>
            <th className="py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {allParts
            .filter((x) => filteredParts || selectedPartsState.map((y) => y.name).includes(x.name))
            .map((part, i) => (
              <tr key={part.id} className={`${filteredParts && i % 2 == 0 ? 'bg-slate-100' : ''}`}>
                {filteredParts && (
                  <td className="">
                    <input
                      type="checkbox"
                      checked={selectedPartsState.map((x) => x.name).includes(part.name)}
                      onChange={() => handleCheckboxChange(part)}
                    />
                  </td>
                )}
                <td className="">{part.name}</td>
                <td className="">{part.cost}</td>
                <td className="">{part.stock}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <button
          type="button"
          className="bg-primary hover:bg-primary/70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={filteredParts ? handleCallback : () => setFilteredParts(!filteredParts)}
        >
          {filteredParts ? 'Confirm Selection' : 'Select More'}
        </button>
        {filteredParts && (
          <button
            type="button"
            className=" text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            onClick={handleOpenModal}
          >
            Add New Part
          </button>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-xl font-bold mb-4">Add New Part</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPartName">
              Name
            </label>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SelectComponent
