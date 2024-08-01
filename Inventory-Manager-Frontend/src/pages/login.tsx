import { login } from '../actionFunctions.ts'
import { notify } from '../utils/notify.ts'

import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = async (formData: FormData) => {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const { value, message } = await login(username, password)
    notify({ error: message, success: value ? 'Welcome back ' + username : undefined })
    if (value) {
      navigate('/')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* @ts-ignore this is a react 19 feature*/}
      <form action={handleLogin} className="w-1/3 mx-auto">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border rounded mt-4 px-3 py-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded mt-4 px-3 py-2"
        />

        <button className="w-full bg-gray-800 mt-4 text-white rounded px-3 py-2" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}
