import StartServer from './Server'
import StartDB from './db'

const app = () => {
  StartDB()
  StartServer()
}

app()

export default app
