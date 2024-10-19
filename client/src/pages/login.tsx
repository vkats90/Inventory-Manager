import Logo from '../assets/Inventory Manager copy.png'
import { useSubmit, Form, Link } from 'react-router-dom'
import GoogleLoginButton from '@/components/google-login-button'

export default function Login() {
  const submit = useSubmit()

  return (
    <div className="container mx-auto px-4 py-8 ">
      <img src={Logo} alt="Inventory Manager" className="w-1/6 mx-auto" />
      <Form
        className="w-1/3 mx-auto mt-10"
        method="post"
        onSubmit={(event) => {
          event.preventDefault()
          submit(event.currentTarget)
        }}
      >
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

        <button
          className="w-full bg-primary mt-4 text-white rounded px-3 py-2 hover:bg-primary/70"
          type="submit"
        >
          Login
        </button>
        <Link to="/register" className="text-center block mt-4 text-primary hover:text-primary/70">
          {' '}
          Sign up{' '}
        </Link>
      </Form>
      <div className="text-center mt-4 m-auto w-fit">
        <a
          href={
            process.env.NODE_ENV === 'production'
              ? '/auth/google'
              : 'http://localhost:4000/auth/google'
          }
        >
          <GoogleLoginButton />
        </a>
      </div>
    </div>
  )
}
