const Skeleton = () => {
  return (
    <div
      role="status"
      className="w-full  p-6 space-y-4 border border-gray-200 divide-y divide-gray-200  shadow animate-pulse dark:divide-gray-500 md:p-6 dark:border-gray-500"
    >
      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-36"></div>
      <div className="flex h-6 items-center justify-between gap-16 pt-4">
        <div className="h-2.5 flex-grow bg-gray-300 rounded-full dark:bg-gray-400 w-24 "></div>

        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-12"></div>
      </div>
      <div className="flex items-center justify-between gap-16 pt-4">
        <div className="h-2.5 flex-grow bg-gray-300 rounded-full dark:bg-gray-400 w-24 "></div>

        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-12"></div>
      </div>
      <div className="flex items-center justify-between gap-16 pt-4">
        <div className="h-2.5 flex-grow bg-gray-300 rounded-full dark:bg-gray-400 w-24 "></div>

        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-12"></div>
      </div>
      <div className="flex items-center justify-between gap-16 pt-4">
        <div className="h-2.5 flex-grow bg-gray-300 rounded-full dark:bg-gray-400 w-24 "></div>

        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-12"></div>
      </div>
      <div className="flex items-center justify-between gap-16 pt-4">
        <div className="h-2.5 flex-grow bg-gray-300 rounded-full dark:bg-gray-400 w-24 "></div>

        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Skeleton
