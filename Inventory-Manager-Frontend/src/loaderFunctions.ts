import { ALL_COMPONENTS, ALL_PRODUCTS, ALL_ORDERS } from './queries'
import { client } from './client'

export const allComponentsLoader = async () => {
  const { data } = await client.query({
    query: ALL_COMPONENTS,
    variables: {},
  })

  return { data: data.allComponents }
}

export const allProductsLoader = async () => {
  const { data } = await client.query({
    query: ALL_PRODUCTS,
    variables: {},
  })

  return { data: data.allProducts }
}

export const allOrdersLoader = async () => {
  const { data } = await client.query({
    query: ALL_ORDERS,
    variables: {},
  })

  return { data: data.allOrders }
}
