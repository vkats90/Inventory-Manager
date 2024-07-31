import { Order, User } from '../types'
import OrderModel from '../models/order'
import { GraphQLError } from 'graphql'

const orderResolver = {
  Query: {
    allOrders: async () => {
      return await OrderModel.find({}).populate('created_by').populate('updated_by')

      /*return orders.map((o) => ({
        ...o.toObject(),
        created_on: o.created_on?.toDateString(),
        updated_on: o.updated_on?.toDateString(),
      }))*/
    },
  },
  Mutation: {
    addOrder: async (_root: Order, args: Order, { currentUser }: { currentUser: User }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const order = new OrderModel({
        ...args,
        priority: args.priority ? args.priority : 1,
        status: 'Created',
        created_by: currentUser.id,
        created_on: Date.now(),
        updated_by: currentUser.id,
        updated_on: Date.now(),
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
    editOrder: async (_root: Order, args: Order, { currentUser }: { currentUser: User }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      if (args.quantity < 0)
        throw new GraphQLError('quantity must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.quantity,
          },
        })
      if (args.status) {
        if (!['Created', 'Ordered', 'Shipped', 'Finished'].includes(args.status))
          throw new GraphQLError('Invalid Status', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.status,
            },
          })
      }
      const order = await OrderModel.findOne({ name: args.name })

      if (!order)
        throw new GraphQLError("order doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        return await OrderModel.findOneAndUpdate(
          { name: args.name },
          {
            ...args,
            updated_by: currentUser.id,
            updated_on: Date.now(),
          },
          { new: true }
        )
          .populate('created_by')
          .populate('updated_by')
      } catch (error) {
        throw new GraphQLError('failed to add order', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    deleteOrder: async (_root: Order, args: Order, { currentUser }: { currentUser: User }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      const order = await OrderModel.findOne({ name: args.name })
      if (!order)
        throw new GraphQLError("order doesn't exist", {
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
      return `Successfully deleted order`
    },
  },
}

export default orderResolver
