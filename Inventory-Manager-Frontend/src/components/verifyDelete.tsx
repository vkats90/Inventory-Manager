const Msg = ({ closeToast, toastProps }: { closeToast: () => void; toastProps: any }) => (
  <div>
    <p>Are you sure you want to delete this entry?</p>
    <div className="flex flex-row items-center w-full justify-center">
      <button
        className="bg-green-300 py-1 text-lg w-16  m-3 rounded-md shadow-sm"
        onClick={() => {
          toastProps.callBackFunction()
          closeToast()
        }}
      >
        Yes
      </button>
      <button
        onClick={closeToast}
        className="bg-red-300 w-16 text-lg py-1  m-3 rounded-md shadow-sm"
      >
        No
      </button>
    </div>
  </div>
)

export default Msg
