import StartServer from '../Server'
import StartDB from '../db'
import { KillDB } from '../db'
import { stopServer } from '../Server'
import ComponentModel from '../models/component'
import request from 'supertest'
import { Component } from '../types'
import userModel from '../models/user'
import mongoose, { mongo } from 'mongoose'
import { query } from 'express'

const uri = 'http://localhost:4000/graphql'
const agent = request.agent(uri)
let currentLocation: string

beforeAll(async () => {
  StartServer()
  await StartDB()

  await userModel.deleteMany({})
  const innitialUser = {
    email: 'marsimillian77@gmail.com',
    password: '123456',
    name: 'Test User',
  }
  await agent.post('/').send({
    query: `mutation Mutation($email: String!, $password: String!, $name: String) {
      createUser(email: $email, password: $password, name: $name) {
        id
        email
      }
    }`,
    variables: innitialUser,
  })

  await agent.post('/').send({
    query: `mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
      email
      id
      name
    permissions {
      location 
      permission
    }
  }
}`,
    variables: { email: 'marsimillian77@gmail.com', password: '123456' },
  })

  const response = await agent
    .post('/')
    .send({
      query: `mutation Mutation($name: String!, $address: String) {
  addLocation(name: $name, address: $address) {
    name
    address
    id
  }
}`,
      variables: { name: 'Vancouver', address: '36 East Hastings St' },
    })
    .withCredentials()

  currentLocation = response.body.data.addLocation.id

  await ComponentModel.deleteMany({})

  await ComponentModel.insertMany([
    {
      name: '5 Totems',
      stock: 4000,
      cost: 0.35,
      location: currentLocation,
    },
    {
      name: 'Shipping Manifest',
      stock: 500,
      cost: 0.3,
      location: currentLocation,
    },
    {
      name: 'EP1 Flow Card',
      stock: 1000,
      cost: 0.05,
      location: currentLocation,
    },
    {
      name: 'Sonar Sheet',
      stock: 400,
      cost: 0.15,
      location: currentLocation,
    },
    {
      name: 'EP2 Flow Card',
      stock: 750,
      cost: 0.04,
      location: currentLocation,
    },
  ])
}, 10000)

afterAll(async () => {
  await KillDB()
  stopServer()
})

describe('test allComponents', () => {
  test('allComponents returns an array', async () => {
    const res = await agent
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
      .withCredentials()

    expect(res.error).toBeFalsy()
    expect(res.body.data).toBeDefined
    expect(res.body.data.allComponents).toHaveLength(5)
  })

  test('allComponents includes a specific record', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `query Query {
        allComponents {
          cost
          name
          stock
          location {
            name
            address
          }
        }
      }`,
      })
      .withCredentials()

    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        cost: 0.04,
        name: 'EP2 Flow Card',
        stock: 750,
        location: {
          name: 'Vancouver',
          address: '36 East Hastings St',
        },
      })
    )
  })
})

describe('test addComponent', () => {
  test('adding a record works', async () => {
    const res = await agent
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
      .withCredentials()

    expect(res.body.data.addComponent).toBeDefined()
    expect(res.body.data.addComponent.name).toBe('EP3 Flow Card')
  })

  test('calling allComponents includes the new record', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `query Query {
        allComponents {
          cost
          name
          stock
          location {
            name
            address
          }
        }
      }`,
      })
      .withCredentials()

    expect(res.body.data.allComponents).toHaveLength(6)
    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        cost: 0.04,
        name: 'EP3 Flow Card',
        stock: 650,
        location: {
          name: 'Vancouver',
          address: '36 East Hastings St',
        },
      })
    )
  })
  test('adding a record without a name returns an error', async () => {
    const res = await agent
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
      .withCredentials()

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe(
      'Variable "$name" of required type "String!" was not provided.'
    )
    expect(res.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
  })

  test('adding a record with negative quantity returns an error', async () => {
    const res = await agent
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
      .withCredentials()

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('stock must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })
})

describe('test editComponent', () => {
  let recordId: mongoose.Types.ObjectId
  let alternateLocation: mongoose.Types.ObjectId
  beforeAll(async () => {
    const res = await agent
      .post('/')
      .send({
        query: `query Query {
        allComponents {
          id
          cost
          name
          stock
          location {
            name
            address
          }
        }
      }`,
      })
      .withCredentials()
    recordId = res.body.data.allComponents.find((x: Component) => x.name === 'EP3 Flow Card').id

    const response = await agent
      .post('/')
      .send({
        query: `mutation Mutation($name: String!, $address: String) {
  addLocation(name: $name, address: $address) {
    name
    address
    id
  }
}`,
        variables: { name: 'Calgary', address: 'Edmonton Trail 123' },
      })
      .withCredentials()

    alternateLocation = response.body.data.addLocation.id
    await agent
      .post('/')
      .send({
        query: `mutation ChangeCurrentLocation($changeCurrentLocationId: ID!) {
  changeCurrentLocation(id: $changeCurrentLocationId) {
    name
    admin {
      email
    }
    address
    id
  }
}`,
        variables: { changeCurrentLocationId: currentLocation },
      })
      .withCredentials()
  })

  test('editing a record works', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation EditComponent($editComponentId: ID!, $name: String!, $stock: Float, $cost: Float, $location: ID!) {
    editComponent(id: $editComponentId, name: $name, stock: $stock, cost: $cost, location: $location) {
      name
      stock
      cost
      id
      location {
        name
      }
    }
  }`,
        variables: {
          editComponentId: recordId,
          name: 'EP3 Flow Card',
          stock: 1850,
          cost: 0.06,
          location: currentLocation,
        },
      })
      .withCredentials()

    expect(res.body.data).toBeDefined()
    expect(res.body.data.editComponent.name).toBe('EP3 Flow Card')
  })
  test('calling allComponents includes the changed record', async () => {
    const res = await agent
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
      .withCredentials()

    expect(res.body.data.allComponents).toHaveLength(6)
    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).toContain(
      JSON.stringify({
        cost: 0.06,
        name: 'EP3 Flow Card',
        stock: 1850,
      })
    )
  })
  test('editing a record without an id returns an error', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation EditComponent($editComponentId: ID!, $name: String!, $stock: Float, $cost: Float, $location: ID!) {
    editComponent(id: $editComponentId, name: $name, stock: $stock, cost: $cost, location: $location) {
      name
      stock
      cost
      id
      location {
        name
      }
    }
  }`,
        variables: { name: 'EP3', stock: 850, cost: 0.04, location: currentLocation },
      })
      .withCredentials()

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe(
      'Variable "$editComponentId" of required type "ID!" was not provided.'
    )
  })

  test('editing a record with negative quantity returns an error', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation EditComponent($editComponentId: ID!, $name: String!, $stock: Float, $cost: Float, $location: ID!) {
    editComponent(id: $editComponentId, name: $name, stock: $stock, cost: $cost, location: $location) {
      name
      stock
      cost
      id
      location {
        name
      }
    }
  }`,
        variables: {
          editComponentId: recordId,
          name: 'EP3 Flow Card',
          stock: -650,
          cost: 0.04,
          location: currentLocation,
        },
      })
      .withCredentials()

    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe('stock must be greater than 0')
    expect(res.body.errors[0].extensions.invalidArgs).toBe(-650)
  })

  test('editing a records location removes it from the old location', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation EditComponent($editComponentId: ID!, $name: String!, $stock: Float, $cost: Float, $location: ID!) {
      editComponent(id: $editComponentId, name: $name, stock: $stock, cost: $cost, location: $location) {
        name
        stock
        cost
        id
        location {
          name
        }
      }
    }`,
        variables: {
          editComponentId: recordId,
          name: 'EP3 Flow Card',
          stock: 650,
          cost: 0.04,
          location: alternateLocation,
        },
      })
      .withCredentials()

    expect(res.body.data).toBeDefined()

    const response = await agent
      .post('/')
      .send({
        query: `
        query AllComponents {
  allComponents {
    id
    cost
    name
    stock
    
  }
}
        `,
      })
      .withCredentials()

    expect(response.body.data.allComponents).toBeDefined()
    expect(response.body.data.allComponents).not.toContain({
      id: recordId,
      name: 'EP3 Flow Card',
      stock: 650,
      cost: 0.04,
    })
  })
})

describe('test deleteComponent', () => {
  test('deleting a record works', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation DeleteComponent($name: String!) {
          deleteComponent(name: $name)
        }`,
        variables: { name: 'Shipping Manifest' },
      })
      .withCredentials()

    expect(res.body.data).toBeDefined()
    expect(res.body.data.deleteComponent).toBe('Successfully deleted Shipping Manifest')
  })
  test("calling allComponents doesn't includes the deleted record", async () => {
    const res = await agent
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
      .withCredentials()

    expect(res.body.data.allComponents).toHaveLength(4)
    expect(res.body.data?.allComponents.map((x: Component) => JSON.stringify(x))).not.toContain(
      JSON.stringify({
        name: 'EP3 Flow Card',
        stock: 1850,
        cost: 0.06,
      })
    )
  })
  test('deleting a record without a name returns an error', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation DeleteComponent($name: String!) {
          deleteComponent(name: $name)
        }`,
        variables: { name: '' },
      })
      .withCredentials()
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("component doesn't exist")
  })

  test('deleting a non existing record returns an error', async () => {
    const res = await agent
      .post('/')
      .send({
        query: `mutation DeleteComponent($name: String!) {
          deleteComponent(name: $name)
        }`,
        variables: { name: 'Book Pages' },
      })
      .withCredentials()
    expect(res.body.errors).toBeDefined()
    expect(res.body.errors[0].message).toBe("component doesn't exist")
  })
})
