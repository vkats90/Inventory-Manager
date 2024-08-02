import { ProductList } from './Products'
import { exampleProducts } from '../assets/data/data'
import { OrderList } from './Orders'
import { exampleOrders } from '../assets/data/data'
import { useLoaderData } from 'react-router-dom'
import { User, Product, Order } from '../types'

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

interface loaderData {
  data: {
    order: Order[]
    product: Product[]
    user: User
  }
}

const Home = () => {
  const { data: loaderData } = useLoaderData() as loaderData

  return (
    <div className="container ">
      <h1 className="text-2xl my-6 font-bold text-center">{'Hello ' + loaderData.user.name}</h1>
      <div className="container flex mx-auto px-4 py-8 gap-4">
        <ProductList products={loaderData.product} InitColumns={initialProductHeaders} />
        <OrderList orders={loaderData.order} InitColumns={initialOrderHeaders} />
      </div>
    </div>
  )
}

export default Home
