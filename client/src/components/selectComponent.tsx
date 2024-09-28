import React, { useState } from 'react'
import { Component, Location } from '../types'
import Modal from './modal' // Assuming you have a Modal component
import AddComponent from '../pages/AddComponent'
import { __Type } from 'graphql'
import { Button } from './ui/button'

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
      : [
          ...selectedPartsState,
          { ...part, location: (part.location as Location).id, __typename: 'ComponentNoLocation' },
        ]
    setSelectedPartsState(updatedParts)
  }

  const handleCallback = () => {
    setFilteredParts(false)
    callback(selectedPartsState)
  }

  return (
    <div className="select-component my-4">
      <label className="block  font-semibold mb-2" htmlFor="parts">
        Parts:
      </label>
      <table className="min-w-full bg-white text-left ">
        {(!(selectedPartsState.length == 0) || filteredParts) && (
          <thead>
            <tr>
              {filteredParts && <th className="py-2">Select</th>}
              <th className="py-2">Name</th>
              <th className="py-2">Cost</th>
              <th className="py-2">Stock</th>
            </tr>
          </thead>
        )}
        <tbody className="">
          {allParts
            .filter((x) => filteredParts || selectedPartsState.map((y) => y.name).includes(x.name))
            .map((part, i) => (
              <tr key={part.id} className={`${filteredParts && i % 2 == 0 ? 'bg-slate-100' : ''} `}>
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
        <Button
          variant="outline"
          type="button"
          className="mt-3"
          onClick={filteredParts ? handleCallback : () => setFilteredParts(!filteredParts)}
        >
          {filteredParts ? 'Confirm Selection' : 'Select More'}
        </Button>
        {filteredParts && (
          <button
            type="button"
            className=" text-gray-700 font-bold py-2 px-4 rounded hover:text-primary/70 focus:outline-none focus:shadow-outline mt-2"
            onClick={handleOpenModal}
          >
            New Part
          </button>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <AddComponent />
        </Modal>
      )}
    </div>
  )
}

export default SelectComponent
