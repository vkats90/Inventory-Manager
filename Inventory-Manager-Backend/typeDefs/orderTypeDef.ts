import { gql } from 'apollo-server-express'

const orderTypeDef = gql`
  type Order {
    name: String!
    quantity: Int!
    priority: Int
    status: String
    created_on: String!
    created_by: User!
    updated_on: String!
    updated_by: User
  }

  extend type Query {
    allOrders: [Order]
  }

  extend type Mutation {
    addOrder(name: String, quantity: Int, priority: Int): Order
    editOrder(name: String, quantity: Int, priority: Int, status: String): Order
    deleteOrder(name: String): String
  }
`

export default orderTypeDef
