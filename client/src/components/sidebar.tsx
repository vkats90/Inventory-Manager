import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LocationDropdown from './locationDropdown'

import Logo from '../assets/Inventory Manager copy.png'
import { AppContext } from '../App'
import { logout } from '../actionFunctions'

const Sidebar: React.FC = () => {
  const urllocation = useLocation()
  const navigate = useNavigate()
  const { setUser, location, setLocation, allLocations } = useContext(AppContext)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Parts', path: '/parts' },
    { name: 'Orders', path: '/orders' },
  ]

  if (urllocation.pathname == '/login' || urllocation.pathname == '/register') return

  return (
    <div className="bg-slate-200 w-64 min-h-screen p-1">
      <div className="bg-white rounded-lg w-full h-full p-2  shadow-lg relative">
        <img src={Logo} alt="logo" className="w-24 mx-auto mb-6" />
        <nav>
          <ul>
            {links.map((link) => (
              <li key={link.name} className="mb-4">
                <Link
                  to={link.path}
                  className={`block p-2 rounded  hover:ring-primary hover:ring-2 transition-colors ${
                    urllocation.pathname === link.path ? 'bg-primary/70 text-white' : ''
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="mb-4">
              <LocationDropdown
                currentLocation={location}
                setCurrentLocation={setLocation}
                allLocations={allLocations}
              />
            </li>
          </ul>
          <a
            onClick={() => {
              setUser('')
              navigate('/login')
              logout()
            }}
            className="absolute bottom-3 left-2 block p-2 rounded hover:ring-2 hover:ring-primary transition-colors cursor-pointer"
          >
            {' '}
            Logout
          </a>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
