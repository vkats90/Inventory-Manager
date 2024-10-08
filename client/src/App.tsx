import { createContext, useState, Suspense, useEffect } from 'react'
import type { Location } from './types'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from './components/sidebar'
import { ToastContainer } from 'react-toastify'
import Skeleton from './components/skeleton'
import Card from './components/card'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useReadQuery, QueryRef } from '@apollo/client'
import { User } from './types'

interface loaderData {
  userLocations: Location[]
  currentLocation: Location
  me: User
}

export const AppContext = createContext<{
  inView: boolean
  setInView: (inView: boolean) => void
  user: string
  setUser: (user: string) => void
  location: Location | null
  setLocation: (location: Location | null) => void
  allLocations: Location[]
  setAllLocations: (userLocations: Location[]) => void
}>({
  inView: false,
  setInView: (_inView: boolean) => {},
  user: '',
  setUser: (_user: string) => {},
  location: null,
  setLocation: (_location: Location | null) => {},
  allLocations: [],
  setAllLocations: (_allLocations: Location[]) => {},
})

function App() {
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const [inView, setInView] = useState(false)
  const [user, setUser] = useState(loaderData?.me?.name || '')
  const [location, setLocation] = useState<Location | null>(loaderData?.currentLocation || '')
  const [allLocations, setAllLocations] = useState<Location[]>(loaderData?.userLocations || [])

  const navigate = useNavigate()

  useEffect(() => {
    if (error && error.graphQLErrors[0].extensions.code === 'UNAUTHORIZED') {
      navigate('/login')
    }
    if (user && !loaderData?.currentLocation) {
      navigate('/no-location')
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        inView,
        setInView,
        user,
        setUser,
        location,
        // @ts-ignore
        setLocation,
        allLocations,
        setAllLocations,
      }}
    >
      <div className="bg-slate-200 min-h-[100vh] flex font-Ubuntu">
        <Sidebar />
        <ToastContainer />
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">
              <Card>
                <Skeleton />
              </Card>
            </div>
          }
        >
          <Outlet />
        </Suspense>
        <Link
          to="/version-release"
          className="absolute right-2 top-2 text-gray-400 text-sm hover:text-gray-400"
        >
          v1.0.1
        </Link>
      </div>
    </AppContext.Provider>
  )
}

export default App
