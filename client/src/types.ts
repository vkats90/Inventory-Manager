// Order type
export type Order = {
  item: Product | Component
  quantity: number
  priority: 1 | 2 | 3 | null
  status: 'Created' | 'Ordered' | 'Shipped' | 'Finished'
  created_on: Date
  created_by: User
  updated_on: Date
  updated_by: User
  id: string
  location: Location
  supplier: string
  image?: ProductImage
}

// User type (assuming a basic structure, adjust as needed)
export type User = {
  email: string
  id: string
  name: string
  permissions: { location: string; permission: 'admin' | 'read' | 'write' }[]
}

// Component type
export type Component = {
  image: ProductImage
  name: string
  stock: number
  cost: number | null
  id: string
  location: Location | string
}

export interface ProductImage {
  url: string
  key: string
  bucket: string
  mimetype: string
}

export type Product = {
  name: string
  stock: number
  cost: number | null
  price: number | null
  SKU: string
  components: Component[] | []
  id: string
  location: Location | string
  image?: ProductImage
}

export interface Location {
  name: string
  id: string
  admin: User
  address: string
}
