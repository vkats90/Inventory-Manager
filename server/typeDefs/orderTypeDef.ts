import { gql } from 'apollo-server-express'

const orderTypeDef = gql`
  union ItemTypes = Product | Component

  type ItemInterface {
    item: ItemTypes
    quantity: Int
  }

  input newItemType {
    item: ID
    itemType: String
    quantity: Int
  }

  type Order {
    id: ID!
    items: [ItemInterface]!
    priority: Int
    status: String
    created_on: String!
    created_by: User!
    updated_on: String!
    updated_by: User
    location: Location
    supplier: String
  }

  extend type ItemTypes {
    __resolveType: String!
  }

  extend type Query {
    allOrders: [Order]!
    findOrder(id: ID!): Order
  }

  extend type Mutation {
    addOrder(items: [newItemType], priority: Int, supplier: String): Order
    editOrder(
      id: ID!
      items: [newItemType]
      priority: Int
      status: String
      location: ID
      supplier: String
    ): Order
    deleteOrder(id: String): String
  }
`

export default orderTypeDef
