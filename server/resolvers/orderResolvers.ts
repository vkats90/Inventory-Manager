import { Order, User, MyContext } from '../types'
import OrderModel from '../models/order'
import ComponentModel from '../models/component'
import ProductModel from '../models/product'
import LocationModel from '../models/location'
import { GraphQLError } from 'graphql'
import order from '../models/order'

const orderResolver = {
  ItemTypes: {
    __resolveType(obj: any) {
      if (obj.price !== undefined) return 'Product'
      else if (obj.price == undefined) return 'Component'
      return null
    },
  },
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

      if (
        ['admin', 'write'].includes(
          context.getUser()?.permissions.find((p) => p.location === context.currentLocation)
            ?.permission as string
        )
      ) {
        throw new GraphQLError('permission not granted', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      let item
      let itemType

      const componentItem = await ComponentModel.findOne({ _id: args.item })
      if (componentItem) {
        item = componentItem
        itemType = 'ComponentModel'
      } else {
        const productItem = await ProductModel.findOne({ _id: args.item })
        if (productItem) {
          item = productItem
          itemType = 'ProductModel'
        }
      }

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
        item: item._id,
        itemType: itemType,
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
      await order.populate('created_by')
      await order.populate('updated_by')
      await order.populate('location')

      await order.populate({
        path: 'item',
        model: itemType,
      })

      return order
    },
    editOrder: async (_root: Order, args: Order, context: MyContext) => {
      const currentUser = context.getUser()
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      if (
        ['admin', 'write'].includes(
          context.getUser()?.permissions.find((p) => p.location === context.currentLocation)
            ?.permission as string
        )
      ) {
        throw new GraphQLError('permission not granted', {
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

      let item
      let itemType

      if (args.item) {
        const componentItem = await ComponentModel.findOne({ _id: args.item })
        if (componentItem) {
          item = componentItem
          itemType = 'ComponentModel'
        } else {
          const productItem = await ProductModel.findOne({ _id: args.item })
          if (productItem) {
            item = productItem
            itemType = 'ProductModel'
          }
        }

        if (!item) {
          throw new GraphQLError("item doesn't exist", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.item,
            },
          })
        }
      }

      if (args.location) {
        const location = await LocationModel.findById(args.location)
        if (!location)
          throw new GraphQLError("location doesn't exist", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.location,
            },
          })
      }

      try {
        return await OrderModel.findOneAndUpdate(
          { _id: args.id, location: context.currentLocation },
          {
            ...args,
            updated_by: currentUser.id,
            updated_on: Date.now(),
          },
          { new: true }
        )
          .populate('created_by')
          .populate('updated_by')
          .populate('location')
          .populate({
            path: 'item',
            model: itemType,
          })
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
      if (
        ['admin', 'write'].includes(
          context.getUser()?.permissions.find((p) => p.location === context.currentLocation)
            ?.permission as string
        )
      ) {
        throw new GraphQLError('permission not granted', {
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
