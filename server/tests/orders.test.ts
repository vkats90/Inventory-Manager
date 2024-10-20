import StartServer from '../Server'
import StartDB from '../db'
import { KillDB } from '../db'
import { stopServer } from '../Server'
import OrderModel from '../models/order'
import request from 'supertest'
import { Order } from '../types'
import userModel from '../models/user'

let uri = 'http://localhost:4000/graphql'

beforeAll(async () => {
  StartServer()
  await StartDB()
  await OrderModel.deleteMany({})

  await userModel.deleteMany({})
  const innitialUser = {
    username: 'marsimillian77',
    password: '123456',
  }
  const res = await request(uri)
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

  await OrderModel.insertMany([
    {
      name: 'EP1 Flow Card',
      quantity: 2000,
      priority: 1,
      status: 'Created',
      created_by: res.body.data.createUser.id,
      created_on: Date.now(),
    },
    {
      name: 'EP2 Flow Card',
      quantity: 3000,
      priority: 1,
      status: 'Created',
      created_by: res.body.data.createUser.id,
      created_on: Date.now(),
    },
  ])
}, 10000)

afterAll(() => {
  KillDB()
  stopServer()
})

describe.skip('test allOrders', () => {
  test('allOrders returns an array', async () => {
    const res = await request(uri).post('/').send({
      query: 'query Query {allOrders {name,priority}}',
    })

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

describe.skip('test addOrder', () => {
  test('adding a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation AddOrder($name: String, $quantity: Int) {
            addOrder(name: $name, quantity: $quantity) {
              name
              priority
              quantity
              status
            }
          }`,
        variables: { name: 'EP3 Flow Card', quantity: 650 },
      })

    expect(res.body.data.addOrder).toBeDefined()
    expect(res.body.data.addOrder.name).toBe('EP3 Flow Card')
  })
  test('calling allOrders includes the new record', async () => {
    const res = await request(uri).post('/').send({
      query: 'query Query {allOrders {name,priority,quantity,status}}',
    })

    expect(res.body.data.allOrders).toHaveLength(3)
    expect(res.body.data?.allOrders.map((x: Order) => JSON.stringify(x))).toContain(
      JSON.stringify({
        name: 'EP3 Flow Card',
        priority: 1,
        quantity: 650,
        status: 'Created',
      })
    )
  })
  test('adding a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation AddOrder($name: String, $quantity: Int) {
            addOrder(name: $name, quantity: $quantity) {
              name
              priority
              quantity
              status
            }
          }`,
        variables: { quantity: 650 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('failed to add new order')
    expect(res.body.errors[0].extensions.error.errors.name.path).toBe('name')
  })

  test('adding a record with negative quantity returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation AddOrder($name: String, $quantity: Int) {
            addOrder(name: $name, quantity: $quantity) {
              name
              priority
              quantity
              status
            }
          }`,
        variables: { name: 'EP3 Flow Card', quantity: -650 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('quantity must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })
})

describe.skip('test editOrder', () => {
  test('editing a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditOrder($name: String, $quantity: Int) {
              editOrder(name: $name, quantity: $quantity) {
                name
                priority
                quantity
                status
              }
            }`,
        variables: { name: 'EP3 Flow Card', quantity: 850 },
      })

    expect(res.body.data.editOrder).toBeDefined()
    expect(res.body.data.editOrder.name).toBe('EP3 Flow Card')
  })
  test('calling allOrders includes the changed record', async () => {
    const res = await request(uri).post('/').send({
      query: 'query Query {allOrders {name,priority,quantity,status}}',
    })

    expect(res.body.data.allOrders).toHaveLength(3)
    expect(res.body.data?.allOrders.map((x: Order) => JSON.stringify(x))).toContain(
      JSON.stringify({
        name: 'EP3 Flow Card',
        priority: 1,
        quantity: 850,
        status: 'Created',
      })
    )
  })
  test('editing a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditOrder($name: String, $quantity: Int) {
              editOrder(name: $name, quantity: $quantity) {
                name
                priority
                quantity
                status
              }
            }`,
        variables: { quantity: 950 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("order doesn't exist")
  })

  test('editing a record with negative quantity returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditOrder($name: String, $quantity: Int) {
              editOrder(name: $name, quantity: $quantity) {
                name
                priority
                quantity
                status
              }
            }`,
        variables: { name: 'EP3 Flow Card', quantity: -650 },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('quantity must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })
  test('editing a record with a wrong status returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation EditOrder($name: String, $quantity: Int, $status: String) {
              editOrder(name: $name, quantity: $quantity, status: $status) {
                name
                priority
                quantity
                status
              }
            }`,
        variables: { name: 'EP3 Flow Card', quantity: 650, status: 'done' },
      })

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('Invalid Status')
    expect(res.body.errors[0].extensions.invalidArgs).toBe('done')
  })
})

describe.skip('test deleteOrder', () => {
  test('deleting a record works', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteOrder($name: String) {
              deleteOrder(name: $name) 
            }`,
        variables: { name: 'EP3 Flow Card' },
      })

    expect(res.body.data).toBeDefined()
    expect(res.body.data.deleteOrder).toBe('Successfully deleted order')
  })
  test("calling allOrders doesn't includes the deleted record", async () => {
    const res = await request(uri).post('/').send({
      query: 'query Query {allOrders {name,priority,quantity,status}}',
    })

    expect(res.body.data.allOrders).toHaveLength(2)
    expect(res.body.data?.allOrders.map((x: Order) => JSON.stringify(x))).not.toContain(
      JSON.stringify({
        name: 'EP3 Flow Card',
        priority: 1,
        quantity: 650,
        status: 'Created',
      })
    )
  })
  test('deleting a record without a name returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteOrder($name: String) {
            deleteOrder(name: $name) 
          }`,
        variables: { name: '' },
      })
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("order doesn't exist")
  })
  test('deleting a non existing record returns an error', async () => {
    const res = await request(uri)
      .post('/')
      .send({
        query: `mutation DeleteOrder($name: String) {
            deleteOrder(name: $name) 
          }`,
        variables: { name: 'Book Pages' },
      })
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("order doesn't exist")
  })
})
