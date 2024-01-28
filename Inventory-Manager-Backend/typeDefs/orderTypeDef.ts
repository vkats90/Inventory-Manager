import { gql } from 'apollo-server-express'

const orderTypeDef = gql`
  type Order {
    name: String!
    quantity: Int!
    priority: Int!
    status: String!
  }

  extend type Query {
    allOrders: [Order]
  }

  extend type Mutation {
    addOrder(name: String, quantity: Int, priority: Int): Order
    editOrder(name: String, quantity: Int, priority: Int): Order
    deleteOrder(name: String!): String
  }
`

export default orderTypeDef
