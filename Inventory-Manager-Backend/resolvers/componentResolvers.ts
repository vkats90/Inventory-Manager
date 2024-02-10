import { Component } from '../types'
import ComponentModel from '../models/component'
import { GraphQLError } from 'graphql'

const componentResolver = {
  Query: {
    allComponents: async () => {
      return ComponentModel.find({})
    },
  },
  Mutation: {
    addComponent: async (_root: Component, args: Component) => {
      const component = new ComponentModel(args)
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      try {
        await component.save()
        return component
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
    editComponent: async (_root: Component, args: Component) => {
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      if (!args.name)
        throw new GraphQLError("component doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        return await ComponentModel.findOneAndUpdate({ name: args.name }, args, {
          new: true,
        })
      } catch (error) {
        throw new GraphQLError('failed to edit component', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    deleteComponent: async (_root: Component, args: Component) => {
      if (!args.name)
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
