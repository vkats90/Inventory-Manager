import { login } from '../actionFunctions.ts'
import { notify } from '../utils/notify.ts'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Inventory Manager copy.png'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const user = await login(email, password)
    notify({
      error: user.message,
      success: !user.message ? 'Welcome back ' + user.name : undefined,
    })
    if (!user.message) {
      navigate('/')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <img src={Logo} alt="Inventory Manager" className="w-1/6 mx-auto" />
      {/* @ts-ignore this is a react 19 feature*/}
      <form action={handleLogin} className="w-1/3 mx-auto mt-10">
        <h1 className="text-2xl font-bold text-Ubuntu text-center">Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded mt-4 px-3 py-2 focus:outline-primary"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded mt-4 px-3 py-2 focus:outline-primary"
        />

        <button className="w-full bg-primary mt-4 text-white rounded px-3 py-2" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}
