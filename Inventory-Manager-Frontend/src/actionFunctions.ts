import { client } from './client'
import { LOGIN, EDIT_COMPONENT, DELETE_COMPONENT, ALL_COMPONENTS } from './queries'

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
