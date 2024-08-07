import { User } from '../types'
import UserModel from '../models/user'
import { GraphQLError } from 'graphql'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userResolver = {
  Query: {
    me: (_root: User, _args: User, { currentUser }: { currentUser: User }) => {
      return currentUser
    },
  },
  Mutation: {
    createUser: async (_root: User, args: User) => {
      const passwordHash = await bcrypt.hash(args.password, 10)
      const user = new UserModel({
        email: args.email,
        name: args.name,
        stores: args.stores,
        passwordHash: passwordHash,
      })
      try {
        return user.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.email,
            error,
          },
        })
      }
    },
    login: async (_root: User, args: User) => {
      const user = await UserModel.findOne({ email: args.email })
      const passwordCheck =
        user == null ? false : await bcrypt.compare(args.password, user.passwordHash)
      if (!(user && passwordCheck)) {
        throw new GraphQLError('Login failed, credentials incorrect', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          },
        })
      }
      const tokenUser = {
        email: user.email,
        id: user._id,
      }
      return { value: jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: 60 * 60 }) }
    },
  },
}

export default userResolver
