import { Component, User, MyContext } from '../types'
import ComponentModel from '../models/component'
import LocationModel from '../models/location'
import { GraphQLError } from 'graphql'

const componentResolver = {
  Query: {
    allComponents: async (_root: User, _args: User, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentLocation = context.currentLocation
      return ComponentModel.find({ location: currentLocation }).populate('location')
    },
    findComponent: async (_root: Component, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const part: Component | null = await ComponentModel.findOne({
        _id: id,
        location: context.currentLocation,
      }).populate('location')

      if (!part)
        throw new GraphQLError("component doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })

      return part
    },
  },
  Mutation: {
    addComponent: async (_root: Component, args: Component, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      if (
        ['admin', 'write'].includes(
          context.getUser()?.permissions.find((p) => p.location === context.currentLocation)
            ?.permission as string
        )
      ) {
        throw new GraphQLError('permission not granted', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const component = new ComponentModel({ ...args, location: context.currentLocation })
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      try {
        await component.save()
        return component.populate('location')
      } catch (error) {
        throw new GraphQLError('failed to add new component', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    editComponent: async (_root: Component, args: Component, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      if (
        ['admin', 'write'].includes(
          context.getUser()?.permissions.find((p) => p.location === context.currentLocation)
            ?.permission as string
        )
      ) {
        throw new GraphQLError('permission not granted', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      const component = await ComponentModel.findOne({
        _id: args.id,
        location: context.currentLocation,
      })
      if (!component)
        throw new GraphQLError("component doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id,
          },
        })

      if (args.location) {
        const location = await LocationModel.findById(args.location)
        if (!location)
          throw new GraphQLError("location doesn't exist", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.location,
            },
          })
      }
      try {
        return await ComponentModel.findOneAndUpdate(
          { _id: args.id, location: context.currentLocation },
          args,
          {
            new: true,
          }
        ).populate('location')
      } catch (error) {
        throw new GraphQLError('failed to edit component', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id,
            error,
          },
        })
      }
    },
    deleteComponent: async (_root: Component, args: Component, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZEDT' },
        })
      }

      if (
        ['admin', 'write'].includes(
          context.getUser()?.permissions.find((p) => p.location === context.currentLocation)
            ?.permission as string
        )
      ) {
        throw new GraphQLError('permission not granted', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const component = await ComponentModel.findOne({
        name: args.name,
        location: context.currentLocation,
      })
      if (!component)
        throw new GraphQLError("component doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        await ComponentModel.findOneAndDelete({ name: args.name })
      } catch (error) {
        throw new GraphQLError('failed to delete component', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return `Successfully deleted ${args.name}`
    },
  },
}

export default componentResolver
