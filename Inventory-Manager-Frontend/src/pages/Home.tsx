import { ProductList } from './Products'
import { exampleProducts } from '../assets/data/data'
import { OrderList } from './Orders'
import { exampleOrders } from '../assets/data/data'

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
  return (
    <div className="container flex mx-auto px-4 py-8 gap-4">
      <ProductList products={exampleProducts} InitColumns={initialProductHeaders} />
      <OrderList orders={exampleOrders} InitColumns={initialOrderHeaders} />
    </div>
  )
}

export default Home
