import React, { useState } from 'react'

interface FilterProps {
  options: string[]
  onFilterChange: (selectedOptions: string[]) => void
  selected: string[]
}

const CheckboxDropdown: React.FC<FilterProps> = ({ options, onFilterChange, selected }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selected)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionChange = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option]

    setSelectedOptions(updatedOptions)
    onFilterChange(updatedOptions)
  }

  return (
    <div className="inline-block text-left relative">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={toggleDropdown}
        >
          Filter
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckboxDropdown
