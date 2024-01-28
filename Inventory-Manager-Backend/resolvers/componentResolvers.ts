import { Component } from '../types'
import ComponentModel from '../models/component'

const componentResolver = {
  Query: {
    allComponents: async () => {
      return ComponentModel.find({})
    },
  },
  Mutation: {
    addComponent: async (_root: Component, args: Component) => {
      const component = new ComponentModel(args)
      await component.save()
      return component
    },
    editComponent: async (_root: Component, args: Component) => {
      return await ComponentModel.findOneAndUpdate({ name: args.name }, args, { new: true })
    },
  },
}

export default componentResolver
