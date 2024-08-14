import { gql } from 'apollo-server-express'

const userTypeDefs = gql`
  type Token {
    value: String!
  }
  type User {
    email: String!
    id: ID!
    name: String
    stores: [String]
  }
  type Query {
    me: User
  }
  type Mutation {
    createUser(email: String!, password: String!, name: String, stores: [String]): User
    login(email: String!, password: String!): User
  }
`

export default userTypeDefs
