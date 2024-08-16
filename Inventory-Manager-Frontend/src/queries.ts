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
  query FindProduct($id: ID!) {
    findProduct(id: $id) {
      name
      stock
      cost
      price
      SKU
      components {
        name
        id
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
        id
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
    $id: ID!
  ) {
    editProduct(
      id: $id
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
        id
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
    }
  }
`

// Mutation to edit an existing component
export const EDIT_COMPONENT = gql`
  mutation EditComponent($id: ID!, $name: String!, $stock: Float, $cost: Float) {
    editComponent(name: $name, stock: $stock, cost: $cost, id: $id) {
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
      id
      name
      quantity
      priority
      status
      created_on
      created_by {
        name
      }
      updated_on
      updated_by {
        name
      }
    }
  }
`

export const PRODUCTS_ORDERS_ME = gql`
  query ProductsOrdersMe {
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
    allOrders {
      id
      name
      quantity
      priority
      status
      created_on
      created_by {
        name
      }
      updated_on
      updated_by {
        name
      }
    }
    me {
      name
      email
      stores
      id
    }
  }
`

export const FIND_ORDER = gql`
  query FindOrder($id: ID!) {
    findOrder(id: $id) {
      id
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
  mutation EditOrder($name: String, $quantity: Int, $priority: Int, $status: String, $id: ID!) {
    editOrder(name: $name, quantity: $quantity, priority: $priority, status: $status, id: $id) {
      id
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
      stores
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
      name
      email
      stores
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
