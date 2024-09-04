import { gql } from 'apollo-server-express'

const componentTypeDefs = gql`
  type Component {
    name: String!
    stock: Float!
    cost: Float
    id: ID!
    location: Location
  }

  extend type Query {
    allComponents: [Component]!
    findComponent(id: ID!): Component
  }

  extend type Mutation {
    addComponent(name: String!, stock: Float, cost: Float): Component
    editComponent(id: ID!, name: String!, stock: Float, cost: Float, location: ID!): Component
    deleteComponent(name: String!): String
  }
`

export default componentTypeDefs
