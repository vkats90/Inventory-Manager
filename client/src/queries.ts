import { gql } from '@apollo/client'

// Query to get all products
export const ALL_PRODUCTS = gql`
  query AllProducts {
    allProducts {
      name
      stock
      cost
      price
      SKU
      components {
        name
        stock
        cost
        id
      }
      id
      location {
        name
        id
      }
    }
  }
`

// Query to find a specific product by name
export const FIND_PRODUCT = gql`
  query FindProduct($id: ID!) {
    findProduct(id: $id) {
      name
      stock
      cost
      price
      SKU
      components {
        name
        stock
        cost
        id
        location
      }
      id
    }
  }
`

export const FIND_PRODUCT_AND_COMPONENTS = gql`
  query FindProductAndComponents($id: ID!) {
    findProduct(id: $id) {
      name
      stock
      cost
      price
      SKU
      components {
        name
        stock
        cost
        id
        location
      }
      id
    }
    allComponents {
      id
      cost
      name
      stock
      location {
        name
        id
      }
    }
  }
`

// Mutation to add a new product
export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $stock: Int!
    $SKU: String!
    $cost: Float
    $price: Float
    $components: [String]
  ) {
    addProduct(
      name: $name
      stock: $stock
      SKU: $SKU
      cost: $cost
      price: $price
      components: $components
    ) {
      name
      stock
      cost
      price
      SKU
      components {
        name
        stock
      }
      id
      location {
        name
      }
    }
  }
`

// Mutation to edit an existing product
export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $components: [String]
    $sku: String
    $price: Float
    $cost: Float
    $stock: Int
    $name: String!
    $id: ID!
    $location: ID
  ) {
    editProduct(
      components: $components
      SKU: $sku
      price: $price
      cost: $cost
      stock: $stock
      name: $name
      id: $id
      location: $location
    ) {
      name
      stock
      cost
      price
      SKU
      components {
        name
        stock
        cost
        id
        location
      }
      id
      location {
        name
        id
      }
    }
  }
`

// Mutation to delete a product
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($name: String!) {
    deleteProduct(name: $name)
  }
`

// Query to get all components
export const ALL_COMPONENTS = gql`
  query AllComponents {
    allComponents {
      id
      cost
      name
      stock
      location {
        name
        id
      }
    }
  }
`

export const FIND_COMPONENT = gql`
  query FindComponent($id: ID!) {
    findComponent(id: $id) {
      name
      stock
      cost
      id
    }
  }
`

// Mutation to add a new component
export const ADD_COMPONENT = gql`
  mutation AddComponent($name: String!, $stock: Float, $cost: Float) {
    addComponent(name: $name, stock: $stock, cost: $cost) {
      name
      stock
      cost
      id
      location {
        name
      }
    }
  }
`

// Mutation to edit an existing component
export const EDIT_COMPONENT = gql`
  mutation EditComponent($id: ID!, $name: String!, $stock: Float, $cost: Float, $location: ID!) {
    editComponent(id: $id, name: $name, stock: $stock, cost: $cost, location: $location) {
      name
      stock
      cost
      id
      location {
        name
        id
      }
    }
  }
`

// Mutation to delete a component
export const DELETE_COMPONENT = gql`
  mutation DeleteComponent($name: String!) {
    deleteComponent(name: $name)
  }
`

// Query to get all orders
export const ALL_ORDERS = gql`
  query AllOrders {
    allOrders {
      id
      priority
      status
      created_on
      created_by {
        email
        name
      }
      updated_on
      updated_by {
        email
        name
      }
      location {
        name
        address
      }
      supplier
      items {
        quantity

        item {
          ... on Product {
            name
            stock
            cost
            price
          }
          ... on Component {
            name
            stock
            cost
          }
        }

        itemType
      }
    }
  }
`

export const SUMMARY = gql`
  query Summary {
    allComponents {
      name
      stock
    }
    allProducts {
      name
      stock
      SKU
    }
    allOrders {
      items {
        quantity
      }
      status
      updated_on
      supplier
      priority
    }
  }
`

export const ME_LOCATIONS = gql`
  query ProductsOrdersMe {
    me {
      email
      id
      name
      permissions {
        location
        permission
      }
    }
    userLocations {
      name
      id
      admin {
        name
      }
      address
    }
    currentLocation {
      name
      id
      address
      admin {
        email
      }
    }
  }
`

export const FIND_ORDER = gql`
  query FindOrder($id: ID!) {
    findOrder(id: $id) {
      id
      items {
        quantity
        itemType
        item {
          ... on Product {
            name
            stock
            cost
            price
            SKU
            id
          }
          ... on Component {
            name
            stock
            cost
            id
          }
        }
      }
      priority
      status
      created_on
      created_by {
        email
        name
      }
      updated_on
      updated_by {
        email
        name
      }
      location {
        name
      }
      supplier
    }
  }
`

// Mutation to add a new order
export const ADD_ORDER = gql`
  mutation AddOrder($quantity: Int, $priority: Int, $item: ID, $supplier: String) {
    addOrder(quantity: $quantity, priority: $priority, item: $item, supplier: $supplier) {
      id

      quantity
      priority
      status
      created_on
      created_by {
        email
        id
        name
      }
      updated_on
      updated_by {
        email
        id
        name
      }
      location {
        name
      }
      supplier
      item {
        ... on Product {
          components {
            name
          }
          stock
        }
        ... on Component {
          name
          cost
        }
      }
    }
  }
`

// Mutation to edit an existing order
export const EDIT_ORDER = gql`
  mutation Mutation(
    $id: ID!
    $items: [newItemType]
    $priority: Int
    $status: String
    $location: ID
    $supplier: String
  ) {
    editOrder(
      id: $id
      items: $items
      priority: $priority
      status: $status
      location: $location
      supplier: $supplier
    ) {
      id
      items {
        item {
          ... on Product {
            name
            stock
            cost
            price
            SKU
          }
          ... on Component {
            name
            stock
            cost
          }
        }
        quantity
        itemType
      }
      priority
      status
      created_on
      created_by {
        name
        email
      }
      updated_on
      updated_by {
        name
        email
      }
      location {
        name
        id
      }
      supplier
    }
  }
`

// Mutation to delete an order
export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: String!) {
    deleteOrder(id: $id)
  }
`

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      id
      name
      permissions {
        location
        permission
      }
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export const ME = gql`
  query Me {
    me {
      email
      id
      name
      permissions {
        location
        permission
      }
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!, $name: String) {
    createUser(email: $email, password: $password, name: $name) {
      email
      id
      name
      permissions {
        location
        permission
      }
    }
  }
`

export const CHANGE_LOCATION = gql`
  mutation ChangeCurrentLocation($id: ID!) {
    changeCurrentLocation(id: $id) {
      name
      admin {
        email
      }
      address
      id
    }
  }
`

export const CREATE_LOCATION = gql`
  mutation AddLocation($name: String!, $address: String) {
    addLocation(name: $name, address: $address) {
      name
      address
      id
    }
  }
`
