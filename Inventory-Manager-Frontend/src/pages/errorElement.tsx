import { Link } from 'react-router-dom'
import CatNotFound from '../assets/cat-not-found.png'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

const ErrorElement = () => {
  const error = useRouteError()

  if (!isRouteErrorResponse(error)) {
    return <img src={CatNotFound} alt="Cat Not Found" className="w-1/3 mx-auto" />
  }

  return (
    <div className="mx-auto w-full px-4 py-8 text-center bg-gradient-to-tr from-slate-200 via-white to-slate-200 min-h-[100vh] flex flex-col   font-Ubuntu">
      <div className="flex-grow"></div>
      <h1 className="text-3xl py-auto ">Oh no!</h1>

      <img src={CatNotFound} alt="Cat Not Found" className="w-1/3 mx-auto" />
      {!isRouteErrorResponse(error) ? (
        <p className="text-3xl mb-7">{(error as Error).message}</p>
      ) : (
        <div>
          <p className="text-3xl">{error?.status}</p>
          <p className="text-3xl mb-7">{error?.statusText}</p>
        </div>
      )}

      <Link to="/" className="text-primary hover:text-primary/70 text-xl flex-grow px-4 py-2">
        {' '}
        Return to safety
      </Link>
    </div>
  )
}

export default ErrorElement
