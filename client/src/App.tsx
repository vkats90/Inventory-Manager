import { createContext, useState, Suspense } from 'react'
import type { Location } from './types'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'
import { ToastContainer } from 'react-toastify'
import Skeleton from './components/skeleton'
import Card from './components/card'

export const AppContext = createContext<{
  inView: boolean
  setInView: (inView: boolean) => void
  user: string
  setUser: (user: string) => void
  location: Location | null
  setLocation: (location: Location | null) => void
  allLocations: Location[]
  setAllLocations: (allLocations: Location[]) => void
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
  const [inView, setInView] = useState(false)
  const [user, setUser] = useState('')
  const [location, setLocation] = useState(null)
  const [allLocations, setAllLocations] = useState<Location[]>([])

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
      </div>
    </AppContext.Provider>
  )
}

export default App
