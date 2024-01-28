import { Order } from '../types'
import OrderModel from '../models/order'

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
      await order.save()
      return order
    },
    editOrder: async (_root: Order, args: Order) => {
      return await OrderModel.findOneAndUpdate({ name: args.name }, args, { new: true })
    },
    deleteOrder: async (_root: Order, args: Order) => {
      await OrderModel.findOneAndDelete({ name: args.name })
      return `Successfully deleted ${args.name}`
    },
  },
}

export default orderResolver
