import { Order, User, MyContext } from '../types'
import OrderModel from '../models/order'
import ComponentModel from '../models/component'
import ProductModel from '../models/product'
import { GraphQLError } from 'graphql'

const orderResolver = {
  Query: {
    allOrders: async (_root: User, _args: User, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentLocation = context.currentLocation
      return await OrderModel.find({ location: currentLocation })
        .populate('created_by')
        .populate('updated_by')
        .populate('item')
        .populate('location')
    },
    findOrder: async (_root: Order, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentLocation = context.currentLocation
      const order: Order | null = await OrderModel.findOne({ _id: id, location: currentLocation })
        .populate('created_by')
        .populate('updated_by')
        .populate('item')
        .populate('location')

      if (!order)
        throw new GraphQLError("order doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })

      return order
    },
  },
  Mutation: {
    addOrder: async (_root: Order, args: Order, context: MyContext) => {
      const currentUser = context.getUser()
      const currentLocation = context.currentLocation

      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const item =
        (await ComponentModel.findOne({ _id: args.item })) ||
        (await ProductModel.findOne({ _id: args.item }))

      if (!item) {
        throw new GraphQLError("item doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.item,
          },
        })
      }

      const order = new OrderModel({
        ...args,
        item,
        priority: args.priority ? args.priority : 1,
        status: 'Created',
        created_by: currentUser.id,
        created_on: Date.now(),
        updated_by: currentUser.id,
        updated_on: Date.now(),
        location: currentLocation,
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
            invalidArgs: args.item.name,
            error,
          },
        })
      }
      return (
        await (await (await order.populate('created_by')).populate('updated_by')).populate('item')
      ).populate('location')
    },
    editOrder: async (_root: Order, args: Order, context: MyContext) => {
      const currentUser = context.getUser()
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
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
      const order = await OrderModel.findOne({ _id: args.id, location: context.currentLocation })

      if (!order)
        throw new GraphQLError("order doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id,
          },
        })

      const item =
        (await ComponentModel.findOne({ _id: args.item })) ||
        (await ProductModel.findOne({ _id: args.item }))

      if (!item) {
        throw new GraphQLError("item doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.item,
          },
        })
      }
      try {
        return await OrderModel.findOneAndUpdate(
          { _id: args.id, location: context.currentLocation },
          {
            ...args,
            item,
            updated_by: currentUser.id,
            updated_on: Date.now(),
          },
          { new: true }
        )
          .populate('created_by')
          .populate('updated_by')
          .populate('item')
          .populate('location')
      } catch (error) {
        throw new GraphQLError('failed to add order', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    deleteOrder: async (_root: Order, args: Order, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const order = await OrderModel.findOne({ _id: args.id, location: context.currentLocation })
      if (!order)
        throw new GraphQLError("order doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id,
          },
        })
      try {
        await OrderModel.findOneAndDelete({ _id: args.id })
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
