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
  username: string
  password: string
  id: string
}
