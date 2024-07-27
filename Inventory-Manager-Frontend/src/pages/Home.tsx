import { ProductList } from './Products'
import { exampleProducts } from '../assets/data/data'
import { OrderList } from './Orders'
import { exampleOrders } from '../assets/data/data'

const initialOrderHeaders = ['Name', 'Quantity', 'Status']

const initialProductHeaders = ['Name', 'Stock', 'Price', 'SKU']

const Home = () => {
  return (
    <div className="container flex mx-auto px-4 py-8 gap-4">
      <ProductList products={exampleProducts} InitColumns={initialProductHeaders} />
      <OrderList orders={exampleOrders} InitColumns={initialOrderHeaders} />
    </div>
  )
}

export default Home
