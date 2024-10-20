import { Order, User, MyContext, OrderItem } from '../types'
import OrderModel from '../models/order'
import ComponentModel from '../models/component'
import ProductModel from '../models/product'
import LocationModel from '../models/location'
import { GraphQLError } from 'graphql'

const orderResolver = {
  ItemTypes: {
    __resolveType(obj: any) {
      if (obj.price !== undefined) return 'Product'
      return 'Component'
    },
  },
  ItemInterface: {
    item: async (parent: OrderItem) => {
      const Model = parent.itemType === 'ProductModel' ? ProductModel : ComponentModel
      // @ts-ignore
      return await Model.findById(parent.item)
    },
  },
  Product: {
    __isTypeOf(obj: any) {
      return obj.price !== undefined
    },
  },
  Component: {
    __isTypeOf(obj: any) {
      return obj.price === undefined
    },
  },
  Query: {
    allOrders: async (_root: any, _args: any, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentLocation = context.currentLocation
      const orders = await OrderModel.find({ location: currentLocation })
        .populate('created_by')
        .populate('updated_by')
        .populate('location')

      return orders
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
    addOrder: async (_root: Order, args: any, context: MyContext) => {
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

      if (args.items.length === 0)
        throw new GraphQLError('item cannot be empty', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.item,
          },
        })

      const componentItems = args.items.filter(
        (i: { item: string; itemType: string; quantity: number }) => i.itemType === 'ComponentModel'
      )
      const productItems = args.items.filter(
        (i: { item: string; itemType: string; quantity: number }) => i.itemType === 'ProductModel'
      )

      for (const item of componentItems) {
        const componentItem = await ComponentModel.findOne({ _id: item.item })
        if (!componentItem) {
          throw new GraphQLError("item doesn't exist", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: item.item,
            },
          })
        }
      }

      for (const item of productItems) {
        const productItem = await ProductModel.findOne({ _id: item.item })
        if (!productItem) {
          throw new GraphQLError("item doesn't exist", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: item.item,
            },
          })
        }
      }

      const order = new OrderModel({
        ...args,
        items: args.items,
        priority: args.priority ? args.priority : 1,
        status: 'Created',
        created_by: currentUser.id,
        created_on: new Date().toISOString(),
        updated_by: currentUser.id,
        updated_on: new Date().toISOString(),
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
            invalidArgs: args.item[0].name,
            error,
          },
        })
      }

      await order.populate('created_by')
      await order.populate('updated_by')
      await order.populate('location')

      return order
    },
    editOrder: async (_root: Order, args: any, context: MyContext) => {
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

      if (args.items) {
        const componentItems = args.items.filter(
          (i: { item: string; itemType: string }) => i.itemType === 'ComponentModel'
        )
        const productItems = args.items.filter(
          (i: { item: string; itemType: string }) => i.itemType === 'ProductModel'
        )

        for (const item of componentItems) {
          const componentItem = await ComponentModel.findOne({ _id: item.item })
          if (!componentItem) {
            throw new GraphQLError("item doesn't exist", {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: item.item,
              },
            })
          }
        }
        for (const item of productItems) {
          const productItems = await ProductModel.findOne({ _id: item.item })
          if (!productItems) {
            throw new GraphQLError("item doesn't exist", {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: item.item,
              },
            })
          }
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
        const order = await OrderModel.findOneAndUpdate(
          { _id: args.id, location: context.currentLocation },
          {
            ...args,
            updated_by: currentUser.id,
            updated_on: Date.now(),
            items: args.items,
          },
          { new: true }
        )
          .populate('created_by')
          .populate('updated_by')
          .populate('location')

        return order
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
