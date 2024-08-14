import { Product, User, MyContext } from '../types'
import ProductModel from '../models/product'
import { GraphQLError } from 'graphql'

const productResolver = {
  Query: {
    allProducts: async (_root: User, _args: User, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      return ProductModel.find({}).populate('components')
    },

    findProduct: async (_root: Product, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const product: Product | null = await ProductModel.findById(id).populate('components')

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
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      const product = new ProductModel(args)
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
      return product.populate('components')
    },

    editProduct: async (_root: Product, args: Product, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
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
      try {
        return await ProductModel.findOneAndUpdate({ _id: args.id }, args, { new: true }).populate(
          'components'
        )
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
