import { ProductList } from './Products'
import { OrderList } from './Orders'
import Card from '@/components/card'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Product, Order } from '../types'
import { useReadQuery, QueryRef } from '@apollo/client'
import { AppContext } from '../App'
import OrderDashboardComponent from '@/components/order-dashboard'
import ProductDashboard from '@/components/product-dashboard'
import { RecommendationCardComponent } from '@/components/recommendation-card'

//@ts-ignore
import React, { useContext, useEffect } from 'react'
import PartsDashboard from '@/components/parts-dashboard'

const mockData = {
  allOrders: [
    { id: 1, status: 'Created', priority: 1 },
    { id: 2, status: 'Ordered', priority: 2 },
    { id: 3, status: 'Shipped', priority: 1 },
    { id: 4, status: 'Finished', priority: 3 },
    { id: 5, status: 'Created', priority: 1 },
  ],
  allProducts: [
    { id: 1, name: 'Product 1', quantity: 5 },
    { id: 2, name: 'Product 2', quantity: 15 },
    { id: 3, name: 'Product 3', quantity: 8 },
  ],
  allParts: [
    { id: 1, name: 'Part 1', quantity: 3 },
    { id: 2, name: 'Part 2', quantity: 12 },
    { id: 3, name: 'Part 3', quantity: 7 },
  ],
}

const totalOrders = mockData.allOrders.length
const ordersByStatus = mockData.allOrders.reduce((acc, order) => {
  acc[order.status] = (acc[order.status] || 0) + 1
  return acc
}, {} as Record<string, number>)
const highPriorityCreatedOrders = mockData.allOrders.filter(
  (order) => order.status === 'Created' && order.priority === 1
).length

const totalProducts = mockData.allProducts.length
const lowStockProducts = mockData.allProducts.filter((product) => product.quantity < 10).length

const totalParts = mockData.allParts.length
const lowStockParts = mockData.allParts.filter((part) => part.quantity < 10).length

interface loaderData {
  allOrders: Order[]
  allProducts: Product[]
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
  supplier: true,
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
  const queryRef = useLoaderData()
  const { data: loaderData, error } = useReadQuery(queryRef as QueryRef<loaderData>)
  const { user } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (error && error.graphQLErrors[0].extensions.code === 'UNAUTHORIZED') {
      navigate('/login')
    }
  }, [error])

  if (error) {
    return <div>Cannot display page</div>
  }

  return (
    <div className="container ">
      <h1 className="text-4xl my-6 font-bold text-center">{'Hello ' + user}</h1>
      <div className="container flex mx-auto px-4 py-8 gap-4">
        <OrderDashboardComponent />
        <ProductDashboard />
        <PartsDashboard />
      </div>
      <div className="container  px-6 py-8 ">
        <RecommendationCardComponent
          orderData={{ totalOrders, highPriorityOrders: highPriorityCreatedOrders }}
          productData={{ totalProducts, lowStockProducts }}
          partData={{ totalParts, lowStockParts }}
        />
      </div>
    </div>
  )
}

export default Home
