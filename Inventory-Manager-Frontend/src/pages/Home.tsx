import { ProductList } from './Products'
import { OrderList } from './Orders'
import { useLoaderData } from 'react-router-dom'
import { User, Product, Order } from '../types'
import { AppContext } from '../App'
//@ts-ignore
import { use } from 'react'

interface loaderData {
  data: {
    order: Order[]
    product: Product[]
    user: User
  }
}

const initialOrderHeaders = {
  id: false,
  name: true,
  quantity: true,
  priority: false,
  status: true,
  created_on: false,
  created_by: false,
  updated_on: false,
  updated_by: false,
}

const initialProductHeaders = {
  id: false,
  name: true,
  stock: true,
  cost: false,
  price: true,
  SKU: false,
  parts: false,
  componenets: false,
}

const Home = () => {
  const { data: loaderData } = useLoaderData() as loaderData
  const { setUser, user } = use(AppContext)

  if (loaderData.user.name) () => setUser(loaderData.user.name)

  return (
    <div className="container ">
      <h1 className="text-2xl my-6 font-bold text-center">{'Hello ' + user}</h1>
      <div className="container flex mx-auto px-4 py-8 gap-4">
        <ProductList products={loaderData.product} InitColumns={initialProductHeaders} />
        <OrderList orders={loaderData.order} InitColumns={initialOrderHeaders} />
      </div>
    </div>
  )
}

export default Home
