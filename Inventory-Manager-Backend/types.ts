import { PassportContext } from 'graphql-passport'
import { Request as ExpressRequest } from 'express'

export interface Product {
  name: string
  stock: number
  cost: number
  price: number
  SKU: string
  components: string[]
  id: string
}

export interface Component {
  name: string
  stock: number
  cost: number
  id: string
}

export interface Order {
  name: string
  quantity: number
  priority: 1 | 2 | 3
  status: 'Created' | 'Ordered' | 'Shipped' | 'Finished'
  created_on: Date
  created_by: string
  updated_on: Date
  updated_by: string
  id: string
}

export interface User {
  email: string
  password: string
  id: string
  name: string
  stores: string[]
}

export interface HashedUser extends Omit<User, 'password'> {
  passwordHash: string
}

export interface MyContext extends PassportContext<HashedUser, ExpressRequest> {}
