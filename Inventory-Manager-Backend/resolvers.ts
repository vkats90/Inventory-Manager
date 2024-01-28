import { Product } from './types'
import { Component } from './types'
const ProductModel = require('./models/product')
const ComponentModel = require('./models/component')

/*let products: Product[] = [
  {
    name: 'Episode 1: Family Secrets',
    stock: 100,
    cost: 2.57,
    price: 19.95,
    SKU: 'EP1',
    components: ['Shipping Manifest', 'EP1 Flow Card'],
    id: '1',
  },
  {
    name: 'Episode 2: Missing Person',
    stock: 50,
    cost: 1.97,
    price: 19.95,
    SKU: 'EP2',
    components: ['Sonar Sheet', 'EP2 Flow Card'],
    id: '2',
  },
]

let components: Component[] = [
  {
    name: 'Shipping Manifest',
    stock: 500,
    cost: 0.3,
    id: '123',
  },
  {
    name: 'EP1 Flow Card',
    stock: 1000,
    cost: 0.05,
    id: '321',
  },
  {
    name: 'EP2 Flow Card',
    stock: 750,
    cost: 0.04,
    id: '564',
  },
  {
    name: 'Sonar Sheet',
    stock: 400,
    cost: 0.15,
    id: '896',
  },
]*/

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
  },
}

export default resolvers
