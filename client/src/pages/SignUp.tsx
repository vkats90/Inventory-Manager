import { useSubmit, Form, Link } from 'react-router-dom'
import Logo from '../assets/Inventory Manager copy.png'
import { notify } from '../utils/notify'

const SignUp = () => {
  const submit = useSubmit()

  return (
    <div className="container mx-auto px-4 py-8 ">
      <img src={Logo} alt="Inventory Manager" className="w-1/6 mx-auto" />
      <Form
        className="w-1/3 mx-auto mt-10"
        method="post"
        onSubmit={(event) => {
          event.preventDefault()
          if (event.currentTarget.password.value !== event.currentTarget.confirmPassword.value) {
            notify({ error: 'Passwords do not match' })
            return
          }
          submit(event.currentTarget)
        }}
      >
        <h1 className="text-2xl font-bold text-Ubuntu text-center">Sign Up</h1>

        <div className=" gap-4 flex items-center align-middle justify-between">
          <label className="block flex-grow text-right font-semibold  mt-3 " htmlFor="email">
            Name:
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-4/5 border rounded mt-4 px-3 py-2 focus:outline-primary"
          />
        </div>

        <div className=" gap-4 flex items-center align-middle justify-between">
          <label className="block flex-grow text-right font-semibold  mt-3 " htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-4/5 border rounded mt-4 px-3 py-2 focus:outline-primary"
          />
        </div>

        <div className=" gap-1 flex items-center align-middle justify-between">
          <label className="block flex-grow text-right font-semibold  mt-3 " htmlFor="email">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-4/5 border rounded mt-4 px-3 py-2 focus:outline-primary"
          />
        </div>
        <div className=" gap-4 flex items-center align-middle justify-between">
          <label className="block flex-grow font-semibold text-right   mt-3 " htmlFor="email">
            Confirm:
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-4/5 border rounded mt-4 px-3 py-2 focus:outline-primary"
          />
        </div>

        <button
          className="w-full bg-primary mt-8 text-white rounded px-3 py-2 hover:bg-primary/70"
          type="submit"
        >
          Sign Up
        </button>
        <span className="text-center justify-center items-center mt-4 flex gap-2 ">
          Already have an account?{' '}
          <Link to="/login" className="text-center block  text-primary hover:text-primary/70">
            Login
          </Link>
        </span>
      </Form>
    </div>
  )
}

export default SignUp
