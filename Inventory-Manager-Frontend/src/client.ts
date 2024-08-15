import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

/*const authLink = setContext((_, { headers }) => {
 // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  if (!token) return headers
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})*/

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  // link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
