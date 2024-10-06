import { useSubmit, Form } from 'react-router-dom'

const CreateLocation = () => {
  const submit = useSubmit()

  return (
    <div className="w-full h-full">
      <div className="relative mx-auto w-1/3 my-auto p-4 mt-[20%] bg-white shadow-lg rounded-lg overflow-hidden">
        <Form
          className="w-full mx-auto flex flex-col items-center"
          method="post"
          onSubmit={(event) => {
            event.preventDefault()
            submit(event.currentTarget)
          }}
        >
          <h1 className="text-2xl font-bold text-Ubuntu text-center">Create Location</h1>

          <div className=" w-full gap-4 flex items-center align-middle justify-between">
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

          <div className=" w-full gap-4 flex items-center align-middle justify-between">
            <label className="block flex-grow text-right font-semibold  mt-3 " htmlFor="email">
              Address:
            </label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-4/5 border rounded mt-4 px-3 py-2 focus:outline-primary"
            />
          </div>

          <button
            className="w-1/2 bg-primary mt-8 text-white rounded px-3 py-2 hover:bg-primary/70"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  )
}

export default CreateLocation
