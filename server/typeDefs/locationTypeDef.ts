import { gql } from 'apollo-server-express'

const locationTypeDefs = gql`
  type Location {
    name: String
    admin: User
    address: String
    id: ID
  }

  extend type Query {
    userLocations: [Location]!
    allLocations: [Location]!
    findLocation(id: ID!): Location
    currentLocation: Location
  }

  extend type Mutation {
    addLocation(name: String!, address: String): Location
    changeCurrentLocation(id: ID!): Location
    editLocation(name: String, admin: ID, address: String, id: ID!): Location
    deleteLocation(id: ID!): String
  }
`

export default locationTypeDefs
