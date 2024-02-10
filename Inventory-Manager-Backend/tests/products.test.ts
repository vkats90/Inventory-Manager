import { schema } from '../index'
import { ApolloServer, BaseContext } from '@apollo/server'
import mongoose from 'mongoose'
import ProductModel from '../models/product'
import ComponentModel from '../models/component'
import request from 'supertest'
import { startStandaloneServer } from '@apollo/server/standalone'
import { Product, Component } from '../types'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

let server: ApolloServer<BaseContext>,
  uri = 'http://localhost:4000/'

let component_id: String
let component_name: String

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI as string)

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
  server = new ApolloServer({
    schema,
  })
  startStandaloneServer(server, {
    listen: { port: 0 },
  })
})

afterAll(async () => {
  await server.stop()
  await mongoose.connection.close()
})

describe('test allProduct', () => {
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

describe('test addProduct', () => {
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
          components: [component_id],
          cost: 2.05,
          name: 'Episode 2: Missing Person',
          price: 19.95,
          stock: 1250,
        },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe(
      'Variable "$name" of required type "String!" was not provided.'
    )
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
    console.log(res.body)
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
/*
describe('test editComponent', () => {
  test('editing a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditComponent($name: String!, $stock: Float, $cost: Float) {
          editComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }}`,
        variables: { name: 'EP3 Flow Card', stock: 1850, cost: 0.06 },
      })

    expect(res.body.data).toBeDefined()
    expect(res.body.data.editComponent.name).toBe('EP3 Flow Card')
  })
  test('calling allComponents includes the changed record', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
        allComponents {
          cost
          name
          stock
        }
      }`,
      })

    expect(res.body.data.allComponents).toHaveLength(6)
    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        cost: 0.06,
        name: 'EP3 Flow Card',
        stock: 1850,
      })
    )
  })
  test('editing a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditComponent($name: String!, $stock: Float, $cost: Float) {
          editComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }}`,
        variables: { stock: 850, cost: 0.04 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe(
      'Variable "$name" of required type "String!" was not provided.'
    )
  })

  test('editing a record with negative quantity returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditComponent($name: String!, $stock: Float, $cost: Float) {
          editComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }}`,
        variables: { name: 'EP3 Flow Card', stock: -650, cost: 0.04 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('stock must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })
})

describe('test deleteComponent', () => {
  test('deleting a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteComponent($name: String!) {
          deleteComponent(name: $name)
        }`,
        variables: { name: 'EP3 Flow Card' },
      })

    expect(res.body.data).toBeDefined()
    expect(res.body.data.deleteComponent).toBe('Successfully deleted EP3 Flow Card')
  })
  test("calling allComponents doesn't includes the deleted record", async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
        allComponents {
          cost
          name
          stock
        }
      }`,
      })

    expect(res.body.data.allComponents).toHaveLength(5)
    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).not.toContain(
      JSON.stringify({
        name: 'EP3 Flow Card',
        stock: 1850,
        cost: 0.06,
      })
    )
  })
  test('deleting a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteComponent($name: String!) {
          deleteComponent(name: $name)
        }`,
      })
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe(
      'Variable "$name" of required type "String!" was not provided.'
    )
  })
})
*/
