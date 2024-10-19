import {
  ALL_COMPONENTS,
  ALL_PRODUCTS,
  ALL_ORDERS,
  ME,
  FIND_COMPONENT,
  FIND_ORDER,
  SUMMARY,
  FIND_PRODUCT_AND_COMPONENTS,
  ME_LOCATIONS,
  ALL_PRODUCTS_AND_COMPONENTS,
} from './queries'
import { client } from './client'
import { redirect, LoaderFunctionArgs } from 'react-router-dom'
import { createQueryPreloader } from '@apollo/client'

const preloadQuery = createQueryPreloader(client)

export const allComponentsLoader = async () => {
  return preloadQuery(ALL_COMPONENTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}

export const allProductsandComponentsLoader = async () => {
  return preloadQuery(ALL_PRODUCTS_AND_COMPONENTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}

export const findComponentLoader = async ({ params }: LoaderFunctionArgs) => {
  console.log('params', params.id)
  return preloadQuery(FIND_COMPONENT, {
    variables: { id: params.partID },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}

export const allProductsLoader = async () => {
  return preloadQuery(ALL_PRODUCTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}

export const findProductLoader = async ({ params }: LoaderFunctionArgs) => {
  return preloadQuery(FIND_PRODUCT_AND_COMPONENTS, {
    variables: { id: params.productID },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })
}

export const allOrdersLoader = async () => {
  return preloadQuery(ALL_ORDERS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}

export const findOrderLoader = async ({ params }: LoaderFunctionArgs) => {
  return preloadQuery(FIND_ORDER, {
    variables: { id: params.orderID },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
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
  return preloadQuery(SUMMARY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}

export const appLoader = async () => {
  return preloadQuery(ME_LOCATIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
}
