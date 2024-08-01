import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const notify = ({ error, success }: { error?: string; success?: string }) => {
  toast.success(success, {
    position: 'bottom-center',
  })

  toast.error(error, {
    position: 'bottom-center',
  })
}
