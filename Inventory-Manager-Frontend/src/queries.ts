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
      }
      id
    }
  }
`

// Query to find a specific product by name
export const FIND_PRODUCT = gql`
  query FindProduct($name: String!) {
    findProduct(name: $name) {
      name
      stock
      cost
      price
      SKU
      components {
        name
      }
      id
    }
  }
`

// Mutation to add a new product
export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $stock: Int!
    $cost: Float
    $price: Float
    $SKU: String!
    $components: [String]
  ) {
    addProduct(
      name: $name
      stock: $stock
      cost: $cost
      price: $price
      SKU: $SKU
      components: $components
    ) {
      name
      stock
      cost
      price
      SKU
      components {
        name
      }
      id
    }
  }
`

// Mutation to edit an existing product
export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $name: String!
    $stock: Int
    $cost: Float
    $price: Float
    $SKU: String
    $components: [String]
  ) {
    editProduct(
      name: $name
      stock: $stock
      cost: $cost
      price: $price
      SKU: $SKU
      components: $components
    ) {
      name
      stock
      cost
      price
      SKU
      components {
        name
      }
      id
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
    }
  }
`

// Mutation to edit an existing component
export const EDIT_COMPONENT = gql`
  mutation EditComponent($name: String!, $stock: Float, $cost: Float) {
    editComponent(name: $name, stock: $stock, cost: $cost) {
      name
      stock
      cost
      id
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
      name
      quantity
      priority
      status
      created_on
      created_by {
        id
        username
      }
      updated_on
      updated_by {
        id
        username
      }
    }
  }
`

// Mutation to add a new order
export const ADD_ORDER = gql`
  mutation AddOrder($name: String, $quantity: Int, $priority: Int) {
    addOrder(name: $name, quantity: $quantity, priority: $priority) {
      name
      quantity
      priority
      status
      created_on
      created_by {
        id
        name
      }
      updated_on
      updated_by {
        id
        name
      }
    }
  }
`

// Mutation to edit an existing order
export const EDIT_ORDER = gql`
  mutation EditOrder($name: String, $quantity: Int, $priority: Int, $status: String) {
    editOrder(name: $name, quantity: $quantity, priority: $priority, status: $status) {
      name
      quantity
      priority
      status
      created_on
      created_by {
        id
        name
      }
      updated_on
      updated_by {
        id
        name
      }
    }
  }
`

// Mutation to delete an order
export const DELETE_ORDER = gql`
  mutation DeleteOrder($name: String!) {
    deleteOrder(name: $name)
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query Me {
    me {
      username
      id
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      username
    }
  }
`
