import { client } from './client'
import {
  LOGIN,
  EDIT_COMPONENT,
  DELETE_COMPONENT,
  EDIT_PRODUCT,
  EDIT_ORDER,
  DELETE_PRODUCT,
  DELETE_ORDER,
} from './queries'
import { Component } from './types'

export const login = async (email: string, password: string) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: { email, password },
    })
    window.localStorage.setItem('token', 'Bearer ' + data.login.value)

    return data.login
  } catch (error: unknown) {
    return error as Error
  }
}

export const editComponent = async (id: string, name: string, cost: number, stock: number) => {
  try {
    const { data } = await client.mutate({
      mutation: EDIT_COMPONENT,
      variables: { id, name, cost, stock },
    })

    return data.editComponent
  } catch (error: unknown) {
    return error as Error
  }
}

export const deleteComponent = async (name: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_COMPONENT,
      variables: { name },
    })

    return data.deleteComponent
  } catch (error: unknown) {
    return error as Error
  }
}

export const editProduct = async (
  id: string,
  name: string,
  cost: number,
  stock: number,
  price: number,
  SKU: string,
  components: Component[] | [] | string[]
) => {
  try {
    if (components.length != 0) {
      components = components.map((component) => (component as Component).id)
    }
    const { data } = await client.mutate({
      mutation: EDIT_PRODUCT,
      variables: { id, name, cost, stock, price, SKU, components },
    })

    return data.editProduct
  } catch (error: unknown) {
    return error as Error
  }
}

export const deleteProduct = async (name: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRODUCT,
      variables: { name },
    })

    return data.deleteProduct
  } catch (error: unknown) {
    return error as Error
  }
}

export const editOrder = async (
  id: string,
  name: string,
  quantity: number,
  priority: number | null,
  status: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: EDIT_ORDER,
      variables: { id, name, quantity, priority, status },
    })

    return data.editOrder
  } catch (error: unknown) {
    return error as Error
  }
}

export const deleteOrder = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_ORDER,
      variables: { id },
    })

    return data.deleteOrder
  } catch (error: unknown) {
    return error as Error
  }
}
