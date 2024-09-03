import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { buildSubgraphSchema } from '@apollo/federation'
import dotenv from 'dotenv'
//import { GraphQLError } from 'graphql'
import session from 'express-session'
import { v4 as uuid } from 'uuid'
import passport from 'passport'
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport'
const path = require('path')
const bcrypt = require('bcrypt')
require('dotenv').config()

dotenv.config()
import { User, HashedUser } from './types'

import componentResolver from './resolvers/componentResolvers'
import componentTypeDefs from './typeDefs/componentTypeDef'
import productTypeDefs from './typeDefs/productTypeDef'
import productResolver from './resolvers/productResolvers'
import orderTypeDefs from './typeDefs/orderTypeDef'
import orderResolver from './resolvers/orderResolvers'
import userResolver from './resolvers/userResolvers'
import userTypeDefs from './typeDefs/userTypeDef'
import locationTypeDefs from './typeDefs/locationTypeDef'
import locationResolver from './resolvers/locationResolvers'
import userModel from './models/user'

export const schema = buildSubgraphSchema([
  { typeDefs: componentTypeDefs, resolvers: componentResolver },
  { typeDefs: productTypeDefs, resolvers: productResolver },
  { typeDefs: orderTypeDefs, resolvers: orderResolver },
  { typeDefs: userTypeDefs, resolvers: userResolver },
  { typeDefs: locationTypeDefs, resolvers: locationResolver },
])

interface MyContext {
  token?: String
}

let server: ApolloServer<MyContext>

const StartServer = async () => {
  passport.serializeUser((user, done) => {
    done(null, (user as User).id)
  })

  passport.deserializeUser(async (id, done) => {
    const currentUser: User | null = await userModel.findById(id)
    done(null, currentUser)
  })

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      const matchingUser: HashedUser | null = await userModel.findOne({ email })
      if (matchingUser && (await bcrypt.compare(password, matchingUser.passwordHash))) {
        done(null, matchingUser)
      } else if (matchingUser) {
        done(new Error('wrong password'), matchingUser)
      } else {
        done(new Error('no matching user'), matchingUser)
      }
    })
  )

  const app = express()
  const httpServer = http.createServer(app)

  server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
  })

  const SESSION_SECRECT = process.env.SESSION_SECRET || 'secret'

  await server.start()

  app.use(
    session({
      genid: (_req: any) => uuid(),
      secret: SESSION_SECRECT,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  }

  app.use(
    '/graphql',
    cors(corsOptions),
    express.json(),
    // @ts-ignore comment
    expressMiddleware(server, {
      cors: false,
      context: ({ req, res }) => buildContext({ req, res, currentLocation: req.headers.location }),
    })
  )

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')))
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'))
    })
  }

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000/graphql`)
}

export const stopServer = async () => {
  await server.stop()
}

export default StartServer
