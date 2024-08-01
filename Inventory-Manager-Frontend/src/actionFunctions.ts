import { client } from './client'
import { LOGIN } from './queries'

export const login = async (username: string, password: string) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: { username, password },
    })

    console.log(data.login.value)
    window.localStorage.setItem('token', 'Bearer ' + data.login.value)

    return data.login
  } catch (error: unknown) {
    return error as Error
  }
}
