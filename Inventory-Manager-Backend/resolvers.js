const { GraphQLError } = require('graphql')

let products = [
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

let components = [
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
    findProduct: (name) => components.filter((x) => x.name === name),
  },
  Mutation: {
    addProduct: (root, args) => {
      const product = {
        ...args,
        id: '1245',
      }
      products = products.concat(product)
      return product
    },
    addComponent: (root, args) => {
      const component = { ...args }
      components = components.concat(component)
      return component
    },
  },
}

module.exports = resolvers
