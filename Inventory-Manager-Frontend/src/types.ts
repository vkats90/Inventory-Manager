// Order type
export type Order = {
  id: string
  name: string
  quantity: number
  priority: number | null
  status: string
  created_on: string
  created_by: User
  updated_on: string
  updated_by: User | null
}

// User type (assuming a basic structure, adjust as needed)
export type User = {
  id: string
  username: string
}

// Component type
export type Component = {
  name: string
  stock: number
  cost: number | null
  id: string
}

export type Product = {
  name: string
  stock: number
  cost: number | null
  price: number | null
  SKU: string
  components: Pick<Component, 'name'>[] | null
  id: string
}
