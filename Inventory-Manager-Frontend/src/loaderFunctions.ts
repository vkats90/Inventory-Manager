import {
  ALL_COMPONENTS,
  ALL_PRODUCTS,
  ALL_ORDERS,
  ME,
  FIND_COMPONENT,
  FIND_PRODUCT,
  FIND_ORDER,
} from './queries'
import { client } from './client'
import { redirect, LoaderFunctionArgs } from 'react-router-dom'
import { notify } from './utils/notify'
import { Order, Product, User } from './types'

export const allComponentsLoader = async () => {
  try {
    const { data } = await client.query({
      query: ALL_COMPONENTS,
      variables: {},
      fetchPolicy: 'network-only',
    })
    return { data: data.allComponents }
  } catch (errors: unknown) {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
}

export const findComponentLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { data } = await client.query({
      query: FIND_COMPONENT,
      variables: { id: params.partID },
    })
    return { data: data.findComponent }
  } catch (errors: unknown) {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
}

export const allProductsLoader = async () => {
  try {
    const { data } = await client.query({
      query: ALL_PRODUCTS,
      variables: {},
      fetchPolicy: 'network-only',
    })

    return { data: data.allProducts }
  } catch (errors: unknown) {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
}

export const findProductLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { data } = await client.query({
      query: FIND_PRODUCT,
      variables: { id: params.productID },
    })

    return { data: data.findProduct }
  } catch (errors: unknown) {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
}

export const allOrdersLoader = async () => {
  try {
    const { data } = await client.query({
      query: ALL_ORDERS,
      variables: {},
      fetchPolicy: 'network-only',
    })

    return { data: data.allOrders }
  } catch (errors: unknown) {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
}

export const findOrderLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { data } = await client.query({
      query: FIND_ORDER,
      variables: { id: params.orderID },
    })

    return { data: data.findOrder }
  } catch (errors: unknown) {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
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

interface HomeLoaderReturn {
  data: {
    order: Order[]
    product: Product[]
    user: User
  }
}

export const homeLoader = async () => {
  try {
    const order = await allOrdersLoader()
    const product = await allProductsLoader()
    const user = await meLoader()

    if (
      (order as Response).status == 302 ||
      (order as Response).status == 302 ||
      (order as Response).status == 302
    )
      return redirect('/login')

    return {
      data: {
        order: (order as HomeLoaderReturn).data,
        product: (product as HomeLoaderReturn).data,
        user: (user as HomeLoaderReturn).data,
      },
    }
  } catch {
    notify({ error: 'You must be logged in to view this page' })
    return redirect('/login')
  }
}
