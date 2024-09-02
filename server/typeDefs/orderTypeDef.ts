import { gql } from 'apollo-server-express'

const orderTypeDef = gql`
  type Order {
    id: ID!
    name: String!
    quantity: Int!
    priority: Int
    status: String
    created_on: String!
    created_by: User!
    updated_on: String!
    updated_by: User
    location: Location
  }

  extend type Query {
    allOrders(location: ID!): [Order]!
    findOrder(id: ID!, location: ID!): Order
  }

  extend type Mutation {
    addOrder(name: String, quantity: Int, priority: Int, location: ID!): Order
    editOrder(
      id: ID!
      name: String
      quantity: Int
      priority: Int
      status: String
      location: ID!
    ): Order
    deleteOrder(id: String): String
  }
`

export default orderTypeDef
