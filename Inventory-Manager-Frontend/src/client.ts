import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  // link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
