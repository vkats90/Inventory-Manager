import { Product, User, MyContext } from '../types'
import ProductModel from '../models/product'
import LocationModel from '../models/location'
import { GraphQLError } from 'graphql'

const productResolver = {
  Query: {
    allProducts: async (_root: User, _args: User, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      return ProductModel.find({ location: context.currentLocation })
        .populate('components')
        .populate('location')
    },

    findProduct: async (_root: Product, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const product: Product | null = await ProductModel.findOne({
        _id: id,
        location: context.currentLocation,
      })
        .populate('components')
        .populate('location')

      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })
      return product
    },
  },
  Mutation: {
    addProduct: async (_root: Product, args: Product, context: MyContext) => {
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
      const product = new ProductModel({ ...args, location: context.currentLocation })
      if (!args.name)
        throw new GraphQLError("name can't be empty", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        await product.save()
      } catch (error) {
        throw new GraphQLError('failed to add new product', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return (await product.populate('components')).populate('location')
    },

    editProduct: async (_root: Product, args: Product, context: MyContext) => {
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
      const product = await ProductModel.findById(args.id)
      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
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
        return await ProductModel.findOneAndUpdate(
          { _id: args.id, location: context.currentLocation },
          args,
          { new: true }
        )
          .populate('components')
          .populate('location')
      } catch (error) {
        throw new GraphQLError('failed to update product', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id,
            error,
          },
        })
      }
    },
    deleteProduct: async (_root: Product, args: Product, context: MyContext) => {
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
      const product = await ProductModel.findOne({ name: args.name })
      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        await ProductModel.findOneAndDelete({ name: args.name })
      } catch (error) {
        throw new GraphQLError('failed to delete product', {
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

export default productResolver
