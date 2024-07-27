import { ProductList } from './Products'
import { exampleProducts } from '../assets/data/data'
import { OrderList } from './Orders'
import { exampleOrders } from '../assets/data/data'

const initialTableHeaders = ['Name', 'Quantity', 'Status']

const Home = () => {
  return (
    <div className="container flex mx-auto px-4 py-8 gap-4">
      <ProductList products={exampleProducts} />
      <OrderList orders={exampleOrders} InitColumns={initialTableHeaders} />
    </div>
  )
}

export default Home
