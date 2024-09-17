import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { buildSubgraphSchema } from '@apollo/federation'
import dotenv from 'dotenv'
import MongoStore from 'connect-mongo'
//import { GraphQLError } from 'graphql'
import session from 'express-session'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import { v4 as uuid } from 'uuid'
import passport from 'passport'
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport'
var GoogleStrategy = require('passport-google-oauth20').Strategy
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
import UserModel from './models/user'
import { VerifyCallback } from 'passport-google-oauth2'

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
    const currentUser: User | null = await UserModel.findById(id)
    done(null, currentUser)
  })

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      const matchingUser: HashedUser | null = await UserModel.findOne({
        email,
      })
      if (matchingUser && (await bcrypt.compare(password, matchingUser.passwordHash))) {
        done(null, matchingUser)
      } else if (matchingUser) {
        done(new Error('wrong password'), matchingUser)
      } else {
        done(new Error('no matching user'), matchingUser)
      }
    })
  )

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback
      ) {
        const matchingUser: HashedUser | null = await UserModel.findOne({
          email: profile._json.email,
        })
        if (matchingUser) {
          done(null, matchingUser)
          return
        }
        const newUser = new UserModel({
          name: profile.displayName,
          email: profile.email._json.email,
        })
        try {
          ;(await newUser.save()) as unknown as HashedUser
          done(null, newUser)
        } catch (error) {
          done(new Error('failed to save user'), null)
        }
      }
    )
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
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
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
    graphqlUploadExpress(),
    // @ts-ignore comment
    expressMiddleware(server, {
      cors: false,
      context: ({ req, res }) =>
        buildContext({
          req,
          res,
          currentLocation: req.session.currentLocation,
        }),
    })
  )

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')))
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'))
    })
  }

  app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: 'http://localhost:4000/graphql',
      failureRedirect: 'http://localhost:4000/graphql',
    })
  )

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000/graphql`)
}

export const stopServer = async () => {
  await server.stop()
}

export default StartServer
