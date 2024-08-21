import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Msg from '../components/verifyDelete'

export const notify = ({ error, success }: { error?: string; success?: string }) => {
  toast.success(success, {
    position: 'bottom-center',
  })

  toast.error(error, {
    position: 'bottom-center',
  })
}

export const verifyDelete = (callBack: () => void) => {
  const toastId = toast(
    Msg({ closeToast: () => toast.dismiss(toastId), toastProps: { callBackFunction: callBack } }),
    {
      position: 'bottom-center',
      autoClose: false,
    }
  )
}
