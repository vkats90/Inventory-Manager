import { gql } from 'apollo-server-express'

const productTypeDefs = gql`
  scalar Upload

  type ProductImage {
    url: String!
    key: String!
    bucket: String!
    mimetype: String!
  }

  type Product {
    name: String!
    stock: Int!
    cost: Float
    price: Float
    SKU: String!
    components: [Component]
    id: ID!
    location: Location
    image: ProductImage
  }

  extend type Query {
    allProducts: [Product!]!
    findProduct(id: ID!): Product
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
      id: ID!
      name: String!
      stock: Int
      cost: Float
      price: Float
      SKU: String
      components: [String]
      location: ID
    ): Product
    deleteProduct(name: String!): String
    uploadProductImage(productId: ID!, file: Upload): Product
  }
`

export default productTypeDefs
