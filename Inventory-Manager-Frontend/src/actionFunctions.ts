import { client } from './client'
import { LOGIN } from './queries'

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
