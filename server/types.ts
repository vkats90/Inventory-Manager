import { PassportContext } from 'graphql-passport'
import { Request as ExpressRequest } from 'express'
import 'express-session'
import 'passport'

export interface Product {
  name: string
  stock: number
  cost: number
  price: number
  SKU: string
  components: string[]
  id: string
  location: Location
}

export interface Component {
  name: string
  stock: number
  cost: number
  id: string
  location: Location
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
  location: Location
}

export interface User {
  email: string
  password: string
  id: string
  name: string
  permissions: { location: string; permission: 'admin' | 'read' | 'write' }[]
}

export interface HashedUser extends Omit<User, 'password'> {
  passwordHash: string
}

export interface Location {
  name: string
  id: string
  admin: User
  address: string
}

export interface MyContext
  extends PassportContext<HashedUser, ExpressRequest, { currentLocation: Location }> {}

declare module 'express-session' {
  interface SessionData {
    currentLocation: string
  }
}
