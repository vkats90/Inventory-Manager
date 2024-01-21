import { Product } from './types'
import { Component } from './types'

let products: Product[] = [
  {
    name: 'Episode 1: Family Secrets',
    stock: 100,
    cost: 2.57,
    price: 19.95,
    SKU: 'EP1',
    subComponents: ['Shipping Manifest', 'EP1 Flow Card'],
    id: '1',
  },
  {
    name: 'Episode 2: Missing Person',
    stock: 50,
    cost: 1.97,
    price: 19.95,
    SKU: 'EP2',
    subComponents: ['Sonar Sheet', 'EP2 Flow Card'],
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
]

const resolvers = {
  Query: {
    allProducts: () => {
      return products.map((x) => {
        return {
          ...x,
          subComponents: x.subComponents.map((n) => components.filter((c) => c.name === n)[0]),
        }
      })
    },
    allComponents: () => components,
    findProduct: (_root: Product, { name }: { name: string }) => {
      const product = products.filter((x) => x.name === name)[0]
      return {
        ...product,
        subComponents: product.subComponents.map((n) => components.filter((c) => c.name === n)[0]),
      }
    },
  },
  Mutation: {
    addProduct: (_root: Product, args: Product) => {
      const product = {
        ...args,
        id: '1245',
      }
      products = products.concat(product)
      return {
        ...product,
        subComponents: product.subComponents.map((n) => components.filter((c) => c.name === n)[0]),
      }
    },
    addComponent: (_root: Product, args: Product) => {
      const component = { ...args, id: '12365' }
      components = components.concat(component)
      return component
    },
  },
}

export default resolvers
