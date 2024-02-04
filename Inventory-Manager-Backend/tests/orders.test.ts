import { schema } from '../index'
import { ApolloServer, BaseContext } from '@apollo/server'
import mongoose from 'mongoose'
import OrderModel from '../models/order'
import request from 'supertest'
import { startStandaloneServer } from '@apollo/server/standalone'
import { Order } from '../types'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI as string)

  await OrderModel.deleteMany({})

  await OrderModel.insertMany([
    {
      name: 'EP1 Flow Card',
      quantity: 2000,
      priority: 1,
      status: 'Created',
    },
    {
      name: 'EP2 Flow Card',
      quantity: 3000,
      priority: 1,
      status: 'Created',
    },
  ])
})

describe('test allOrders', () => {
  let server: ApolloServer<BaseContext>,
    uri = 'http://localhost:4000/'

  beforeAll(() => {
    server = new ApolloServer({
      schema,
    })
    startStandaloneServer(server, {
      listen: { port: 0 },
    })
  })

  afterAll(async () => {
    await server.stop()
  })

  test('allOrders returns an array', async () => {
    const res = await request(uri).post('/').send({
      query: 'query Query {allOrders {name,priority}}',
    })

    console.log(res.body)

    expect(res.error).toBeFalsy()
    expect(res.body.data).toBeDefined
    expect(res.body.data.allOrders).toHaveLength(2)
  })

  test('allOrders includes a specific record', async () => {
    const res = await request(uri).post('/').send({
      query: 'query Query {allOrders {name,priority}}',
    })

    expect(res.body.data?.allOrders.map((x: Order) => JSON.stringify(x))).toContain(
      JSON.stringify({
        name: 'EP2 Flow Card',
        priority: 1,
      })
    )
  })
})
