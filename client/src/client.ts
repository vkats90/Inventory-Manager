import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: '/graphql',
  credentials: 'include',
  // link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
