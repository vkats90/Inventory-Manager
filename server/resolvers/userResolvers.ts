import { User } from '../types'
import UserModel from '../models/user'
import { GraphQLError } from 'graphql'
import { MyContext, HashedUser } from '../types'
const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')

const userResolver = {
  Query: {
    me: (_root: User, _args: User, context: MyContext) => {
      //@ts-ignore
      return context.getUser()
    },
  },
  Mutation: {
    createUser: async (_root: User, args: User, context: MyContext) => {
      const passwordHash = await bcrypt.hash(args.password, 10)
      const user = new UserModel({
        email: args.email,
        name: args.name,
        passwordHash: passwordHash,
      })
      try {
        const res = (await user.save()) as unknown as HashedUser
        await context.login(res)
        return res
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
    login: async (_root: User, { email, password }: User, context: MyContext) => {
      //@ts-ignore
      const { user } = await context.authenticate('graphql-local', { email, password })

      await context.login(user as unknown as HashedUser)

      context.req.session.currentLocation = user?.permissions[0].location
      return user

      /*const user = await UserModel.findOne({ email: args.email })
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
      return { value: jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: 60 * 60 }) } */
    },
    logout: (_root: User, _args: User, context: MyContext) => {
      context.logout()
      return 'Successfully logged out'
    },
    changePermissions: async (
      _root: User,
      args: { user: string; location: string; permission: 'read' | 'write' | 'admin' },
      context: MyContext
    ) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentUser = context.getUser()
      const user: User | null = await UserModel.findById(args.user)
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      if (
        !currentUser?.permissions?.find(
          (perm) => perm.location === args.location && perm.permission === 'admin'
        )
      ) {
        throw new GraphQLError('You do not have permission to change permissions', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      if (
        !user.permissions.length ||
        !user.permissions.find((perm) => perm.location && perm.location === args.location)
      ) {
        user.permissions.push({
          location: args.location,
          permission: args.permission,
        })
      }
      user.permissions = user.permissions.map((perm) =>
        perm.location === args.location
          ? { location: args.location, permission: args.permission }
          : perm
      )
    },
  },
}

export default userResolver
