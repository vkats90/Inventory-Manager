import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'production' ? '/graphql' : 'http://localhost:4000/graphql',
  credentials: 'include',
  // link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
