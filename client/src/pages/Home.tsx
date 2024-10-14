import { useMemo } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Product, Order, Component } from '../types'
import { useReadQuery, QueryRef } from '@apollo/client'
import { AppContext } from '../App'
import OrderDashboardComponent from '@/components/order-dashboard'
import ProductDashboard from '@/components/product-dashboard'
import { RecommendationCardComponent } from '@/components/recommendation-card'

//@ts-ignore
import React, { useContext, useEffect } from 'react'
import PartsDashboard from '@/components/parts-dashboard'

interface loaderData {
  allComponents: Component[]
  allOrders: Order[]
  allProducts: Product[]
}

interface OrderStatus {
  Created: number
  Ordered: number
  Shipped: number
  Finished: number
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

  const totalOrders = useMemo(() => loaderData.allOrders.length, [loaderData.allOrders])
  const {
    ordersByStatus,
    highPriorityCreatedOrders,
    totalProducts,
    lowStockProducts,
    totalParts,
    lowStockParts,
  } = useMemo(() => {
    const ordersByStatus = loaderData.allOrders?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as OrderStatus)

    const highPriorityCreatedOrders = loaderData.allOrders.filter(
      (order) => order.status === 'Created' && order.priority === 1
    ).length

    const totalProducts = loaderData.allProducts.length
    const lowStockProducts = loaderData.allProducts.filter((product) => product.stock < 100).length

    const totalParts = loaderData.allComponents.length
    const lowStockParts = loaderData.allComponents.filter((part) => part.stock < 100).length

    return {
      ordersByStatus,
      highPriorityCreatedOrders,
      totalProducts,
      lowStockProducts,
      totalParts,
      lowStockParts,
    }
  }, [loaderData.allOrders, loaderData.allProducts, loaderData.allComponents])

  return (
    <div className="container ">
      <h1 className="text-4xl my-6 font-bold text-center">{'Hello ' + user}</h1>
      <div className="container grid grid-cols-2 mx-auto px-4 py-8 gap-4">
        <div className="col-span-2">
          <OrderDashboardComponent
            orderData={loaderData.allOrders}
            ordersByStatus={ordersByStatus}
            highPriorityCreatedOrders={highPriorityCreatedOrders}
          />
        </div>
        <ProductDashboard totalProducts={totalProducts} lowStockProducts={lowStockProducts} />
        <PartsDashboard totalParts={totalParts} lowStockParts={lowStockParts} />
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
