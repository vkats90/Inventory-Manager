import { createContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'
import { ToastContainer } from 'react-toastify'

export const AppContext = createContext({})

function App() {
  const [inView, setInView] = useState(false)
  const [user, setUser] = useState('')

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    <AppContext value={{ inView, setInView, user, setUser }}>
      <div className="bg-slate-200 min-h-[100vh] flex">
        <Sidebar />
        <ToastContainer />
        <Outlet />
      </div>
    </AppContext>
  )
}

export default App
