import { Product } from '../types'
import ProductModel from '../models/product'

const productResolver = {
  Query: {
    allProducts: async () => {
      return ProductModel.find({}).populate('components')
    },

    findProduct: (_root: Product, { name }: { name: string }) => {
      return ProductModel.find({ name }).populate('components')
    },
  },
  Mutation: {
    addProduct: async (_root: Product, args: Product) => {
      const product = new ProductModel(args)
      await product.save()
      return product
    },

    editProduct: async (_root: Product, args: Product) => {
      return await ProductModel.findOneAndUpdate({ name: args.name }, args, { new: true })
    },
    deleteProduct: async (_root: Product, args: Product) => {
      await ProductModel.findOneAndDelete({ name: args.name })
      return `Successfully deleted ${args.name}`
    },
  },
}

export default productResolver
