import { ActionFunctionArgs, redirect } from 'react-router-dom'
import { client } from './client'
import {
  LOGIN,
  EDIT_COMPONENT,
  DELETE_COMPONENT,
  EDIT_PRODUCT,
  EDIT_ORDER,
  DELETE_PRODUCT,
  DELETE_ORDER,
  ADD_COMPONENT,
  ADD_PRODUCT,
  ADD_ORDER,
  LOGOUT,
  CREATE_USER,
  CHANGE_LOCATION,
  CREATE_LOCATION,
} from './queries'
import { Component } from './types'
import { notify } from './utils/notify'

export const login = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  try {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: { email, password },
    })
    const user = data.login
    notify({
      error: user.message,
      success: !user.message ? 'Welcome back ' + user.name : undefined,
    })

    return redirect('/')
  } catch (error: unknown) {
    notify({
      error: (error as Error).message,
    })
    return error as Error
  }
}

export const register = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    await client.mutate({
      mutation: CREATE_USER,
      variables: { email, password, name, permissions: [] },
    })
    notify({ success: 'Account created successfully' })

    return redirect('/no-location')
  } catch (error: unknown) {
    notify({ error: 'Failed to create account' })
    return error as Error
  }
}

export const logout = async () => {
  const { data } = await client.mutate({
    mutation: LOGOUT,
  })
  notify({ success: data.logout })
}

export const addComponent = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const stock = parseInt(formData.get('stock') as string)
  const cost = parseFloat(formData.get('cost') as string)

  try {
    const { data } = await client.mutate({
      mutation: ADD_COMPONENT,
      variables: { name, cost, stock },
    })
    notify({ success: 'Component added successfully' })

    return data
  } catch (error: unknown) {
    notify({ error: 'Failed to add component' })
    return error as Error
  }
}

export const editComponent = async (
  id: string,
  name: string,
  cost: number,
  stock: number,
  location: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: EDIT_COMPONENT,
      variables: { id, name, cost, stock, location },
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
      update: (cache) => {
        cache.evict({ fieldName: 'allComponents' })
      },
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
  components: Component[] | [] | string[],
  location: string
) => {
  try {
    if (components.length != 0) {
      components = components.map((component) => (component as Component).id)
    }
    const { data } = await client.mutate({
      mutation: EDIT_PRODUCT,
      variables: { id, name, cost, stock, price, SKU, components, location },
    })
    return data.editProduct
  } catch (error: unknown) {
    return error as Error
  }
}

export const addProduct = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const stock = parseInt(formData.get('stock') as string)
  const cost = parseFloat(formData.get('cost') as string)
  const price = parseFloat(formData.get('price') as string)
  const SKU = formData.get('SKU') as string
  let components = JSON.parse(formData.get('components') as string) as Component[] | [] | string[]

  try {
    if (components && components.length != 0) {
      components = components.map((component) => (component as Component).id)
    }
    const { data } = await client.mutate({
      mutation: ADD_PRODUCT,
      variables: { name, cost, stock, price, SKU, components },
    })

    notify({ success: 'Product added successfully' })

    return data
  } catch (error: unknown) {
    return error as Error
  }
}

export const deleteProduct = async (name: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRODUCT,
      variables: { name },
      update: (cache) => {
        cache.evict({ fieldName: 'allProducts' })
      },
    })

    return data.deleteProduct
  } catch (error: unknown) {
    return error as Error
  }
}

export const editOrder = async (
  id: string,
  items: [{ item: string; quantity: number }],
  priority: number | null,
  status: string,
  supplier: string,
  location: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: EDIT_ORDER,
      variables: { id, name, items, priority, status, supplier, location },
    })

    return data.editOrder
  } catch (error: unknown) {
    return error as Error
  }
}

export const addOrder = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const priority = parseInt(formData.get('priority') as string)
  try {
    const { data } = await client.mutate({
      mutation: ADD_ORDER,
      variables: { name, quantity, priority, status, location },
    })

    notify({ success: 'Order added successfully' })

    return data
  } catch (error: unknown) {
    notify({ error: 'Failed to add order' })
    return error as Error
  }
}

export const deleteOrder = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_ORDER,
      variables: { id },
      update: (cache) => {
        cache.evict({ fieldName: 'allOrders' })
      },
    })

    return data.deleteOrder
  } catch (error: unknown) {
    return error as Error
  }
}

export const changeCurrentLocation = async ({ request }: ActionFunctionArgs) => {
  try {
    console.log(request.body)
    const { data } = await client.mutate({
      mutation: CHANGE_LOCATION,
      //@ts-ignore
      variables: { id: request.body?.id },
    })
    notify({ success: 'Location Changed' })
    return data.changeLocation
  } catch (error: unknown) {
    return error as Error
  }
}

export const addLocation = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const address = formData.get('address') as string
  const name = formData.get('name') as string

  try {
    await client.mutate({
      mutation: CREATE_LOCATION,
      variables: { name, address },
    })
    notify({ success: 'Location created successfully' })

    return redirect('/')
  } catch (error: unknown) {
    notify({ error: 'Failed to create location' })
    return error as Error
  }
}
