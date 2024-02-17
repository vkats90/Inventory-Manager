import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from '@apollo/federation'
import dotenv from 'dotenv'
dotenv.config()

import componentResolver from './resolvers/componentResolvers'
import componentTypeDefs from './typeDefs/componentTypeDef'
import productTypeDefs from './typeDefs/productTypeDef'
import productResolver from './resolvers/productResolvers'
import orderTypeDefs from './typeDefs/orderTypeDef'
import orderResolver from './resolvers/orderResolvers'
import userResolver from './resolvers/userResolvers'
import userTypeDefs from './typeDefs/userTypeDef'

export const schema = buildSubgraphSchema([
  { typeDefs: componentTypeDefs, resolvers: componentResolver },
  { typeDefs: productTypeDefs, resolvers: productResolver },
  { typeDefs: orderTypeDefs, resolvers: orderResolver },
  { typeDefs: userTypeDefs, resolvers: userResolver },
])

let server: ApolloServer

const StartServer = () => {
  server = new ApolloServer({
    schema,
  })
  startStandaloneServer(server, {
    listen: { port: 4000 },
  })
    .then(({ url }) => {
      console.log(`Server ready at ${url}`)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const stopServer = async () => {
  await server.stop()
}

export default StartServer
