import { ALL_COMPONENTS, ALL_PRODUCTS, ALL_ORDERS, ME } from './queries'
import { client } from './client'
import { redirect } from 'react-router-dom'

export const allComponentsLoader = async () => {
  const user = await meLoader()
  // @ts-ignore
  if (!user.data) {
    return redirect('/login')
  }

  const { data } = await client.query({
    query: ALL_COMPONENTS,
    variables: {},
  })

  return { data: data.allComponents }
}

export const allProductsLoader = async () => {
  const user = await meLoader()
  // @ts-ignore
  if (!user.data) {
    return redirect('/login')
  }

  const { data } = await client.query({
    query: ALL_PRODUCTS,
    variables: {},
  })

  return { data: data.allProducts }
}

export const allOrdersLoader = async () => {
  const user = await meLoader()
  // @ts-ignore
  if (!user.data) {
    return redirect('/login')
  }
  const { data } = await client.query({
    query: ALL_ORDERS,
    variables: {},
  })

  return { data: data.allOrders }
}

export const meLoader = async () => {
  const token = window.localStorage.getItem('token')

  if (!token) {
    return redirect('/login')
  }

  const { data } = await client.query({
    query: ME,
    variables: {},
  })

  const user = data.me
  if (!user && token) {
    console.log('Token is invalid')
    window.localStorage.removeItem('token')
    return redirect('/login')
  }

  return { data: data.me }
}
