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
    deleteComponent: async (_root: Component, args: Component) => {
      await ComponentModel.findOneAndDelete({ name: args.name })
      return `Successfully deleted ${args.name}`
    },
  },
}

export default componentResolver
