import { Product } from './types'
import { Component } from './types'
const ProductModel = require('./models/product')
const ComponentModel = require('./models/component')

const resolvers = {
  Query: {
    allProducts: async () => {
      return ProductModel.find({}).populate('components')
    },

    allComponents: async () => {
      return ComponentModel.find({})
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

    addComponent: async (_root: Component, args: Component) => {
      const component = new ComponentModel(args)
      await component.save()
      return component
    },
    editComponent: async (_root: Component, args: Component) => {
      return await ComponentModel.findOneAndUpdate({ name: args.name }, args, { new: true })
    },
    editProduct: async (_root: Product, args: Product) => {
      return await ProductModel.findOneAndUpdate({ name: args.name }, args, { new: true })
    },
  },
}

export default resolvers
