import { Order } from '../types'
import OrderModel from '../models/order'
import { GraphQLError } from 'graphql'

const orderResolver = {
  Query: {
    allOrders: async () => {
      return await OrderModel.find({})
    },
  },
  Mutation: {
    addOrder: async (_root: Order, args: Order) => {
      const order = new OrderModel({
        ...args,
        priority: args.priority ? args.priority : 1,
        status: 'Created',
      })
      if (args.quantity < 0)
        throw new GraphQLError('quantity must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.quantity,
          },
        })
      try {
        await order.save()
      } catch (error) {
        throw new GraphQLError('failed to add new order', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return order
    },
    editOrder: async (_root: Order, args: Order) => {
      if (args.quantity < 0)
        throw new GraphQLError('quantity must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.quantity,
          },
        })
      if (args.status) {
        if (!['Created', 'Ordered', 'Finished'].includes(args.status))
          throw new GraphQLError('Invalid Status', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.status,
            },
          })
      }
      if (!args.name)
        throw new GraphQLError("order doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        return await OrderModel.findOneAndUpdate({ name: args.name }, args, { new: true })
      } catch (error) {
        throw new GraphQLError('failed to add order', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    deleteOrder: async (_root: Order, args: Order) => {
      if (!args.name)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        await OrderModel.findOneAndDelete({ name: args.name })
      } catch (error) {
        throw new GraphQLError('failed to delete order', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
      return `Successfully deleted ${args.name}`
    },
  },
}

export default orderResolver
