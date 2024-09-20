import { ProductList } from './Products'
import { OrderList } from './Orders'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Product, Order } from '../types'
import { useReadQuery, QueryRef } from '@apollo/client'
import { notify } from '../utils/notify'
import { AppContext } from '../App'
//@ts-ignore
import React, { useContext, useEffect } from 'react'

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
      notify({ error: 'You have to sign in to view this page' })
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
        <ProductList products={loaderData.allProducts} InitColumns={initialProductHeaders} />
        <OrderList orders={loaderData.allOrders} InitColumns={initialOrderHeaders} />
      </div>
    </div>
  )
}

export default Home
