import { schema } from '../index'
import { ApolloServer, BaseContext } from '@apollo/server'
import mongoose from 'mongoose'
import ComponentModel from '../models/component'
import request from 'supertest'
import { startStandaloneServer } from '@apollo/server/standalone'
import { Component } from '../types'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

let server: ApolloServer<BaseContext>,
  uri = 'http://localhost:4000/'

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI as string)

  await ComponentModel.deleteMany({})

  await ComponentModel.insertMany([
    {
      name: '5 Totems',
      stock: 4000,
      cost: 0.35,
    },
    {
      name: 'Shipping Manifest',
      stock: 500,
      cost: 0.3,
    },
    {
      name: 'EP1 Flow Card',
      stock: 1000,
      cost: 0.05,
    },
    {
      name: 'Sonar Sheet',
      stock: 400,
      cost: 0.15,
    },
    {
      name: 'EP2 Flow Card',
      stock: 750,
      cost: 0.04,
    },
  ])
  server = new ApolloServer({
    schema,
  })
  startStandaloneServer(server, {
    listen: { port: 0 },
  })
}, 10000)

afterAll(async () => {
  await server.stop()
  await mongoose.connection.close()
})

describe('test allComponents', () => {
  test('allComponents returns an array', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `query Query {
        allComponents {
          cost
          name
          stock
          id
        }
      }`,
      })

    expect(res.error).toBeFalsy()
    expect(res.body.data).toBeDefined
    expect(res.body.data.allComponents).toHaveLength(5)
  })

  test('allComponents includes a specific record', async () => {
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

    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        cost: 0.04,
        name: 'EP2 Flow Card',
        stock: 750,
      })
    )
  })
})

describe('test addComponent', () => {
  test('adding a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Float, $cost: Float) {
          addComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }
        }`,
        variables: { name: 'EP3 Flow Card', stock: 650, cost: 0.04 },
      })

    expect(res.body.data.addComponent).toBeDefined()
    expect(res.body.data.addComponent.name).toBe('EP3 Flow Card')
  })
  test('calling allComponents includes the new record', async () => {
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
        cost: 0.04,
        name: 'EP3 Flow Card',
        stock: 650,
      })
    )
  })
  test('adding a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Float, $cost: Float) {
          addComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }
        }`,
        variables: { stock: 650, cost: 0.04 },
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
        query: `mutation Mutation($name: String!, $stock: Float, $cost: Float) {
          addComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }
        }`,
        variables: { name: 'EP3 Flow Card', stock: 650, cost: 0.04 },
      })
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('failed to add new component')
    expect(res.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
  })

  test('adding a record with negative quantity returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $stock: Float, $cost: Float) {
          addComponent(name: $name, stock: $stock, cost: $cost) {
            cost
            name
            stock
          }
        }`,
        variables: { name: 'EP3 Flow Card', stock: -650, cost: 0.04 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('stock must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })
})

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
        variables: { name: '' },
      })
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("component doesn't exist")
  })
  test('deleting a non existing record returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteComponent($name: String!) {
          deleteComponent(name: $name)
        }`,
        variables: { name: 'Book Pages' },
      })
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("component doesn't exist")
  })
})
