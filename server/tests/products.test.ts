import StartServer from '../Server'
import StartDB from '../db'
import { KillDB } from '../db'
import { stopServer } from '../Server'
import ProductModel from '../models/product'
import ComponentModel from '../models/component'
import request from 'supertest'
import { Product, Component } from '../types'
import userModel from '../models/user'

let uri = 'http://localhost:4000/graphql'

let component_id: String
let component_name: String

beforeAll(async () => {
  StartServer()
  await StartDB()

  await userModel.deleteMany({})
  const innitialUser = {
    username: 'marsimillian77',
    password: '123456',
  }
  await request(uri)
    .post('/')
    .send({
      query: `mutation Mutation($username: String!, $password: String!) {
      createUser(username: $username, password: $password) {
        id
        username
      }
    }`,
      variables: innitialUser,
    })

  const authUser = await request(uri)
    .post('/')
    .send({
      query: `mutation Mutation($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        value
      }
    }`,
      variables: { username: 'marsimillian77', password: '123456' },
    })

  const components = await ComponentModel.find({})
  component_id = components[0].id
  component_name = components[0].name

  await ProductModel.deleteMany({})

  await ProductModel.insertMany([
    {
      name: 'Episode 3: Ancient Mysteries',
      stock: 436,
      cost: 3,
      price: 19.95,
      SKU: 'EP3',
      components: [component_id],
    },
  ])
}, 10000)

afterAll(async () => {
  KillDB()
  stopServer()
})

describe.skip('test allProduct', () => {
  test('allProduct returns an array', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
          allProducts {
            SKU
            components {
              name
            }
            cost
            name
            price
            stock
          }
        }`,
      })

    expect(res.error).toBeFalsy()
    expect(res.body.data).toBeDefined
    expect(res.body.data.allProducts).toHaveLength(1)
  })

  test('allProducts includes a specific record', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
          allProducts {
            SKU
            components {
              name
            }
            cost
            name
            price
            stock
          }
        }`,
      })

    expect(res.body.data?.allProducts.map((x: Product) => JSON.stringify(x))).toContain(
      JSON.stringify({
        SKU: 'EP3',
        components: [{ name: component_name }],
        cost: 3,
        name: 'Episode 3: Ancient Mysteries',
        price: 19.95,
        stock: 436,
      })
    )
  })
})

describe.skip('test addProduct', () => {
  test('adding a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int!, $sku: String!, $cost: Float, $price: Float, $components: [String]) {
          addProduct(name: $name, stock: $stock, SKU: $sku, cost: $cost, price: $price, components: $components) {
            cost
            SKU
            name
            price
            stock   
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          cost: 2.05,
          name: 'Episode 2: Missing Person',
          price: 19.95,
          stock: 1250,
        },
      })

    expect(res.body.data.addProduct).toBeDefined()
    expect(res.body.data.addProduct.name).toBe('Episode 2: Missing Person')
  })
  test('calling allProducts includes the new record', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
          allProducts {
            SKU
            components {
              name
            }
            cost
            name
            price
            stock
          }
        }`,
      })

    expect(res.body.data.allProducts).toHaveLength(2)
    expect(res.body.data?.allProducts.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        SKU: 'EP2',
        components: [{ name: component_name }],
        cost: 2.05,
        name: 'Episode 2: Missing Person',
        price: 19.95,
        stock: 1250,
      })
    )
  })
  test('adding a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int!, $sku: String!, $cost: Float, $price: Float, $components: [String]) {
          addProduct(name: $name, stock: $stock, SKU: $sku, cost: $cost, price: $price, components: $components) {
            cost
            SKU
            name
            price
            stock   
          }
        }`,
        variables: {
          sku: 'EP2',
          name: '',
          components: [component_id],
          cost: 2.05,
          price: 19.95,
          stock: 1250,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("name can't be empty")
    expect(res.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
  })

  test('adding a record with an existing name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int!, $sku: String!, $cost: Float, $price: Float, $components: [String]) {
          addProduct(name: $name, stock: $stock, SKU: $sku, cost: $cost, price: $price, components: $components) {
            cost
            SKU
            name
            price
            stock   
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          cost: 2.05,
          name: 'Episode 3: Ancient Mysteries',
          price: 19.95,
          stock: 1250,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('failed to add new product')
    expect(res.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
  })

  test('adding a record with negative quantity returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int!, $sku: String!, $cost: Float, $price: Float, $components: [String]) {
          addProduct(name: $name, stock: $stock, SKU: $sku, cost: $cost, price: $price, components: $components) {
            cost
            SKU
            name
            price
            stock   
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          cost: 2.05,
          name: 'Episode 2: Missing Person',
          price: 19.95,
          stock: -650,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('stock must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })
})

describe.skip('test editProduct', () => {
  test('editing a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int, $cost: Float, $price: Float, $sku: String, $components: [String]) {
          editProduct(name: $name, stock: $stock, cost: $cost, price: $price, SKU: $sku, components: $components) {
            SKU
            components {
              name
            }
            name
            price
            stock
            cost
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          cost: 2.45,
          name: 'Episode 2: Missing Person',
          price: 19.95,
          stock: 1650,
        },
      })

    expect(res.body.data).toBeDefined()
    expect(res.body.data.editProduct.name).toBe('Episode 2: Missing Person')
  })
  test('calling allProducts includes the changed record', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
          allProducts {
            SKU
            components {
              name
            }
            cost
            name
            price
            stock
          }
        }`,
      })

    expect(res.body.data.allProducts).toHaveLength(2)
    expect(res.body.data?.allProducts.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        SKU: 'EP2',
        components: [{ name: component_name }],
        cost: 2.45,
        name: 'Episode 2: Missing Person',
        price: 19.95,
        stock: 1650,
      })
    )
  })
  test('editing a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int, $cost: Float, $price: Float, $sku: String, $components: [String]) {
          editProduct(name: $name, stock: $stock, cost: $cost, price: $price, SKU: $sku, components: $components) {
            SKU
            components {
              name
            }
            name
            price
            stock
            cost
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          name: '',
          cost: 2.45,
          price: 19.95,
          stock: 1650,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("product doesn't exist")
  })
  test("editing a record that doesn't exist returns an error", async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int, $cost: Float, $price: Float, $sku: String, $components: [String]) {
          editProduct(name: $name, stock: $stock, cost: $cost, price: $price, SKU: $sku, components: $components) {
            SKU
            components {
              name
            }
            name
            price
            stock
            cost
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          name: 'Episdode 4: On The Run',
          cost: 2.45,
          price: 19.95,
          stock: 1650,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("product doesn't exist")
  })

  test('editing a record with negative quantity returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Int, $cost: Float, $price: Float, $sku: String, $components: [String]) {
          editProduct(name: $name, stock: $stock, cost: $cost, price: $price, SKU: $sku, components: $components) {
            SKU
            components {
              name
            }
            name
            price
            stock
            cost
          }
        }`,
        variables: {
          sku: 'EP2',
          components: [component_id],
          name: 'Episode 2: Missing Person',
          cost: 2.45,
          price: 19.95,
          stock: -1650,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('stock must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-1650)
  })
})

describe.skip('test deleteProduct', () => {
  test('deleting a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteProduct($name: String!) {
          deleteProduct(name: $name)
        }`,
        variables: { name: 'Episode 2: Missing Person' },
      })

    expect(res.body.data).toBeDefined()
    expect(res.body.data.deleteProduct).toBe('Successfully deleted Episode 2: Missing Person')
  })
  test("calling allProducts doesn't includes the deleted record", async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
          allProducts {
            SKU
            components {
              name
            }
            cost
            name
            price
            stock
          }
        }`,
      })

    expect(res.body.data.allProducts).toHaveLength(1)
    expect(res.body.data?.allProducts.map((x: Product) => JSON.stringify(x))).not.toContain(
      JSON.stringify({
        sku: 'EP2',
        components: [component_id],
        cost: 2.05,
        name: 'Episode 2: Missing Person',
        price: 19.95,
        stock: 1250,
      })
    )
  })
  test('deleting a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteProduct($name: String!) {
          deleteProduct(name: $name)
        }`,
        variables: { name: '' },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("product doesn't exist")
  })
  test('deleting a non existing record returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteProduct($name: String!) {
          deleteProduct(name: $name)
        }`,
        variables: { name: 'Episode 6: Buried' },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("product doesn't exist")
  })
})
