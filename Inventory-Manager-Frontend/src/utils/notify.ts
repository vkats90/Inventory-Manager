import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const notify = ({
  error,
  success,
  info,
}: {
  error?: string
  success?: string
  info?: string
}) => {
  toast.success(success, {
    position: 'bottom-center',
  })

  toast.error(error, {
    position: 'bottom-center',
  })

  toast.info(info, {
    position: 'bottom-center',
  })
}
