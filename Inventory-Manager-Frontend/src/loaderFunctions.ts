import {
  ALL_COMPONENTS,
  ALL_PRODUCTS,
  ALL_ORDERS,
  ME,
  FIND_COMPONENT,
  FIND_ORDER,
  PRODUCTS_ORDERS_ME,
  FIND_PRODUCT_AND_COMPONENTS,
} from './queries'
import { client } from './client'
import { redirect, LoaderFunctionArgs } from 'react-router-dom'
import { createQueryPreloader } from '@apollo/client'

const preloadQuery = createQueryPreloader(client)

export const allComponentsLoader = async () => {
  return preloadQuery(ALL_COMPONENTS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  })
}

export const findComponentLoader = async ({ params }: LoaderFunctionArgs) => {
  return preloadQuery(FIND_COMPONENT, {
    variables: { id: params.partID },
    errorPolicy: 'all',
  })
}

export const allProductsLoader = async () => {
  return preloadQuery(ALL_PRODUCTS, {
    errorPolicy: 'all',
  })
}

export const findProductLoader = async ({ params }: LoaderFunctionArgs) => {
  return preloadQuery(FIND_PRODUCT_AND_COMPONENTS, {
    variables: { id: params.productID },

    errorPolicy: 'all',
  })
}

export const allOrdersLoader = async () => {
  return preloadQuery(ALL_ORDERS, {
    errorPolicy: 'all',
  })
}

export const findOrderLoader = async ({ params }: LoaderFunctionArgs) => {
  return preloadQuery(FIND_ORDER, {
    variables: { id: params.orderID },
    errorPolicy: 'all',
  })
}

export const meLoader = async () => {
  const { data } = await client.query({
    query: ME,
    variables: {},
  })

  const user = data.me
  if (!user) {
    return redirect('/login')
  }

  return user
}

export const homeLoader = async () => {
  return preloadQuery(PRODUCTS_ORDERS_ME, {
    errorPolicy: 'all',
  })
}
