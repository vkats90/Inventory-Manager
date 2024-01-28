import { gql } from 'apollo-server-express'

const productTypeDefs = gql`
  type Product {
    name: String!
    stock: Int!
    cost: Float
    price: Float
    SKU: String!
    components: [Component]
    id: ID!
  }

  extend type Query {
    allProducts: [Product!]!
    findProduct(name: String!): Product
  }

  extend type Mutation {
    addProduct(
      name: String!
      stock: Int!
      cost: Float
      price: Float
      SKU: String!
      components: [String]
    ): Product
    editProduct(
      name: String!
      stock: Int
      cost: Float
      price: Float
      SKU: String
      components: [String]
    ): Product
  }
`

export default productTypeDefs
