const typeDefs = `
  type Component{
    name: String!
    stock: Float!
    cost: Float
    id: ID!
  }

  type Product{
    name: String!
    stock: Int!
    cost: Float
    price: Float
    SKU: String!
    components: [Component]
    id: ID!
  }


  type Query {
    allProducts: [Product!]!
    findProduct(name: String!): Product
    allComponents: [Component]
  }

  type Mutation {
    addProduct(
        name: String!
        stock: Int!
        cost: Float
        price: Float
        SKU: String!
        components: [String]
    ):Product
    addComponent(
        name: String!
        stock: Float
        cost: Float
    ):Component
    editProduct(
        name: String!
        stock: Int
        cost: Float
        price: Float
        SKU: String
        components: [String]
    ):Product
    editComponent(
        name: String!
        stock: Float
        cost: Float
    ):Component
  }
`

export default typeDefs
