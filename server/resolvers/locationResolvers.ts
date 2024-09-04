import { Location, User, MyContext } from '../types'
import LocationtModel from '../models/location'
import UserModal from '../models/user'
import { GraphQLError } from 'graphql'

const locationResolver = {
  Query: {
    allLocations: async (_root: Location, _args: Location, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      return LocationtModel.find({}).populate('admin')
    },
    userLocations: async (_root: User, _args: User, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      let userLocations: string[] | undefined = context
        .getUser()
        ?.permissions.map((permission) => permission.location)
      return LocationtModel.find({ id: { $in: userLocations } }).populate('admin')
    },
    findLocation: async (_root: Location, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const part: Location | null = await LocationtModel.findById(id)

      if (!part)
        throw new GraphQLError("location doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })

      return part
    },
    currentLocation: async (_root: Location, _args: Location, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentUser = context.getUser()
      const currentLocation = context.req.session.currentLocation

      if (!currentUser?.permissions.length) {
        throw new GraphQLError('no locations exist', {
          extensions: { code: 'EMPTY' },
        })
      }

      if (!currentLocation) {
        throw new GraphQLError('no location set', {
          extensions: { code: 'EMPTY' },
        })
      }

      if (
        !currentUser.permissions
          .map((permission) => permission.location.toString())
          .includes(currentLocation)
      ) {
        throw new GraphQLError('user does not have access to this location', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      return LocationtModel.findById(currentLocation).populate('admin')
    },
  },
  Mutation: {
    addLocation: async (_root: Location, args: { name: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentUser = context.getUser()
      if (
        currentUser?.permissions.length != 0 &&
        !currentUser?.permissions.find((permission) => permission.permission === 'admin')
      ) {
        throw new GraphQLError('only admin can add locations', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const location = new LocationtModel({
        ...args,
        admin: currentUser,
      })

      try {
        await location.save()
        await UserModal.findByIdAndUpdate(currentUser.id, {
          $push: { permissions: { location, permission: 'admin' } },
        })

        return location
      } catch (error) {
        throw new GraphQLError('failed to add new location', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    changeCurrentLocation: async (_root: Location, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentUser = context.getUser()
      const location: Location | null = await LocationtModel.findById(id).populate('admin')

      if (!location)
        throw new GraphQLError("location doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })

      if (
        !currentUser?.permissions.map((permission) => permission.location.toString()).includes(id)
      ) {
        throw new GraphQLError('user does not have access to this location', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      context.req.session.currentLocation = id
      return location
    },
    editLocation: async (_root: Location, args: Location, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentUser = context.getUser()

      const location: Location | null = await LocationtModel.findById(args.id)

      if (!location)
        throw new GraphQLError("location doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: args.id,
          },
        })

      if (location.admin.id != currentUser?.id)
        throw new GraphQLError('only admin can edit locations', {
          extensions: { code: 'UNAUTHORIZED' },
        })

      try {
        await LocationtModel.findByIdAndUpdate(args.id, args)
        return LocationtModel.findById(args.id)
      } catch (error) {
        throw new GraphQLError('failed to edit location', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    deleteLocation: async (_root: Location, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const currentUser = context.getUser()

      const location: Location | null = await LocationtModel.findById(id)

      if (!location)
        throw new GraphQLError("location doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })

      if (location.admin.id != currentUser?.id)
        throw new GraphQLError('only admin can delete locations', {
          extensions: { code: 'UNAUTHORIZED' },
        })

      try {
        await LocationtModel.findByIdAndDelete(id)
        await UserModal.findByIdAndUpdate(currentUser?.id, { $pull: { permissions: { location } } })
        return location
      } catch (error) {
        throw new GraphQLError('failed to delete location', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: id,
            error,
          },
        })
      }
    },
  },
}

export default locationResolver
