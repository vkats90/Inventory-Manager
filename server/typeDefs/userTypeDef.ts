import { gql } from 'apollo-server-express'

const userTypeDefs = gql`
  type Token {
    value: String!
  }
  type Permission {
    location: String
    permission: String
  }

  type User {
    email: String!
    id: ID!
    name: String
    permissions: [Permission]
  }
  type Query {
    me: User
  }
  type Mutation {
    createUser(email: String!, password: String!, name: String): User
    changePermissions(user: ID!, location: ID!, permission: String): User
    login(email: String!, password: String!): User
    logout: String
  }
`

export default userTypeDefs
