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
