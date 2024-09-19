import React, { useState } from 'react'
import { Location } from '../types'

interface LocationDropdownProps {
  currentLocation: Location | null
  allLocations: Location[]
  setCurrentLocation: (location: Location | null) => void
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  currentLocation,
  allLocations,
  setCurrentLocation,
}: LocationDropdownProps) => {
  const [chosenLocation, setChosenLocation] = useState<Location | null>(currentLocation)

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = allLocations.find((location) => location.id === e.target.value)
    if (location) {
      setChosenLocation(location)
      setCurrentLocation(location)
    }
  }

  return (
    <div className=" items-center block p-1 rounded  hover:ring-primary hover:ring-2 transition-colors">
      <select
        name="location"
        id="location"
        value={chosenLocation?.id || currentLocation?.id}
        onChange={handleLocationChange}
        className="focus:outline-none w-full"
      >
        <option value="" disabled>
          Select a location
        </option>
        {allLocations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LocationDropdown
