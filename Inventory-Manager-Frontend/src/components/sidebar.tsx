import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
//@ts-ignore
import { use } from 'react'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = use(AppContext)

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Parts', path: '/parts' },
    { name: 'Orders', path: '/orders' },
  ]

  if (location.pathname == '/login') return

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8">Inventory Manager</h1>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.name} className="mb-4">
              <Link
                to={link.path}
                className={`block p-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === link.path ? 'bg-gray-700' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <a
          onClick={() => {
            localStorage.clear()
            setUser('')
            navigate('/login')
          }}
          className="absolute bottom-3 left-8 block p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {' '}
          Logout
        </a>
      </nav>
    </div>
  )
}

export default Sidebar
