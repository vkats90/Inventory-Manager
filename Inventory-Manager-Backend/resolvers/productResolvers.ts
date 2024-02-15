import { Product } from '../types'
import ProductModel from '../models/product'
import { GraphQLError } from 'graphql'

const productResolver = {
  Query: {
    allProducts: async () => {
      return ProductModel.find({}).populate('components')
    },

    findProduct: async (_root: Product, { name }: { name: string }) => {
      const product = await ProductModel.find({ name }).populate('components')

      if (product.length === 0)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name,
          },
        })
    },
  },
  Mutation: {
    addProduct: async (_root: Product, args: Product) => {
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
      return product
    },

    editProduct: async (_root: Product, args: Product) => {
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      const product = await ProductModel.findOne({ name: args.name })
      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        return await ProductModel.findOneAndUpdate({ name: args.name }, args, { new: true })
      } catch (error) {
        throw new GraphQLError('failed to update product', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    deleteProduct: async (_root: Product, args: Product) => {
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
