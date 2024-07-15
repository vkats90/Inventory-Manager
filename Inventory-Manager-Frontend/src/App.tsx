import { createContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './components/topbar'

function App() {
  const [inView, setInView] = useState(false)
  const AppContext = createContext({ inView, setInView })
  return (
    //@ts-ignore
    <AppContext value={{ inView, setInView }}>
      <div>
        <TopBar />
        <Outlet />
      </div>
    </AppContext>
  )
}

export default App
