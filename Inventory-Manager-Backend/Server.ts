import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { buildSubgraphSchema } from '@apollo/federation'
import dotenv from 'dotenv'

dotenv.config()
import { User } from './types'

import componentResolver from './resolvers/componentResolvers'
import componentTypeDefs from './typeDefs/componentTypeDef'
import productTypeDefs from './typeDefs/productTypeDef'
import productResolver from './resolvers/productResolvers'
import orderTypeDefs from './typeDefs/orderTypeDef'
import orderResolver from './resolvers/orderResolvers'
import userResolver from './resolvers/userResolvers'
import userTypeDefs from './typeDefs/userTypeDef'
import userModel from './models/user'
const jwt = require('jsonwebtoken')

export const schema = buildSubgraphSchema([
  { typeDefs: componentTypeDefs, resolvers: componentResolver },
  { typeDefs: productTypeDefs, resolvers: productResolver },
  { typeDefs: orderTypeDefs, resolvers: orderResolver },
  { typeDefs: userTypeDefs, resolvers: userResolver },
])

interface MyContext {
  token?: String
}

let server: ApolloServer<MyContext>

const StartServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
  })

  await server.start()

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      // @ts-ignore comment
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser: User | null = await userModel.findById(decodedToken.id)
          return { currentUser }
        }
      },
    })
  )
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000/`)
}

export const stopServer = async () => {
  await server.stop()
}

export default StartServer
