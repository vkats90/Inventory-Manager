const typeDefs = `
  type Component{
    name: String!
    stock: Float
    cost: Float
    id: ID!
  }

  type Product{
    name: String!
    stock: Int!
    cost: Float
    price: Float
    SKU: String!
    subComponents: [Component]
    id: ID!
  }


  type Query {
    allProducts: [Product!]!
    findProduct(name: String!): Person
    allComponents: [Components]
  }

  type Mutation {
    addProduct(
        name: String!
        stock: Int!
        cost: Float
        price: Float
        SKU: String!
        subComponents: [Component]
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
        SKU: String!
        subComponents: [Component]
    ):Product
    editComponent(
        name: String!
        stock: Float
        cost: Float
    )
  }
`

mo
