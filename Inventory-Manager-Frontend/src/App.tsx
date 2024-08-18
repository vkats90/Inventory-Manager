import { createContext, useState, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'
import { ToastContainer } from 'react-toastify'

export const AppContext = createContext({
  inView: false,
  setInView: (_inView: boolean) => {},
  user: '',
  setUser: (_user: string) => {},
})

function App() {
  const [inView, setInView] = useState(false)
  const [user, setUser] = useState('')

  return (
    <AppContext.Provider value={{ inView, setInView, user, setUser }}>
      <div className="bg-slate-200 min-h-[100vh] flex font-Ubuntu">
        <Sidebar />
        <ToastContainer />
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </AppContext.Provider>
  )
}

export default App
