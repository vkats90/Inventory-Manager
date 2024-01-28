import { gql } from 'apollo-server-express'

const orderTypeDef = gql`
  type Order {
    name: String!
    quantity: Int!
    priority: Int!
  }

  extend type Query {
    allOrders: [Order]
  }

  extend type Mutation {
    addOrder(name: String, quantity: Int, priority: Int!): Order
  }
`

export default orderTypeDef
