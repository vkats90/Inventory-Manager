import { gql } from 'apollo-server-express'

const componentTypeDefs = gql`
  type Component {
    name: String!
    stock: Float!
    cost: Float
    id: ID!
  }

  extend type Query {
    allComponents: [Component]
  }

  extend type Mutation {
    addComponent(name: String!, stock: Float, cost: Float): Component
    editComponent(name: String!, stock: Float, cost: Float): Component
  }
`

export default componentTypeDefs
