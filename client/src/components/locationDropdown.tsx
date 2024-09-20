import React, { useContext } from 'react'
import { AppContext } from '../App'
import { useMutation } from '@apollo/client'
import { CHANGE_LOCATION } from '../queries'
import { client } from '../client'

const LocationDropdown: React.FC = () => {
  const { setLocation, allLocations, location } = useContext(AppContext)
  const [changeLocation] = useMutation(CHANGE_LOCATION)

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const location = allLocations.find((location) => location.id === event.target.value)
    if (location) {
      setLocation(location)
      changeLocation({
        variables: { id: location.id },
        client,
        onCompleted: () => {
          window.location.reload()
        },
      })
    }
  }

  return (
    <div className=" items-center block p-1 rounded  hover:ring-primary hover:ring-2 transition-colors">
      <select
        name="location"
        id="location"
        value={location?.id}
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
