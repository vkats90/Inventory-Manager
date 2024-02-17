import { gql } from 'apollo-server-express'

const userTypeDefs = gql`
  type Token {
    value: String!
  }
  type User {
    username: String!
    id: ID!
  }
  type Query {
    me: User
  }
  type Mutation {
    createUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
  }
`

export default userTypeDefs
