import { Product, User, MyContext } from '../types'
import ProductModel from '../models/product'
import LocationModel from '../models/location'
import { GraphQLError } from 'graphql'
import { PutObjectCommand, GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3'
import { s3 } from '../s3config'
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import uuid from 'uuid'

interface UploadProductImageArgs {
  productId: string
  file: Promise<FileUpload>
}

const productResolver = {
  Upload: GraphQLUpload,

  Query: {
    allProducts: async (_root: User, _args: User, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      return ProductModel.find({ location: context.currentLocation })
        .populate('components')
        .populate('location')
    },

    findProduct: async (_root: Product, { id }: { id: string }, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }
      const product: Product | null = await ProductModel.findOne({
        _id: id,
        location: context.currentLocation,
      })
        .populate('components')
        .populate('location')

      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: id,
          },
        })
      return product
    },
  },
  Mutation: {
    addProduct: async (_root: Product, args: Product, context: MyContext) => {
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
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      const product = new ProductModel({ ...args, location: context.currentLocation })
      if (!args.name)
        throw new GraphQLError("name can't be empty", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        await product.save()
      } catch (error) {
        throw new GraphQLError('failed to add new product', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return (await product.populate('components')).populate('location')
    },

    editProduct: async (_root: Product, args: Product, context: MyContext) => {
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
      if (args.stock < 0)
        throw new GraphQLError('stock must be greater than 0', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.stock,
          },
        })
      const product = await ProductModel.findById(args.id)
      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })

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
        return await ProductModel.findOneAndUpdate(
          { _id: args.id, location: context.currentLocation },
          args,
          { new: true }
        )
          .populate('components')
          .populate('location')
      } catch (error) {
        throw new GraphQLError('failed to update product', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id,
            error,
          },
        })
      }
    },
    deleteProduct: async (_root: Product, args: Product, context: MyContext) => {
      if (!context.isAuthenticated()) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'UNAUTHORIZEDT' },
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
      const product = await ProductModel.findOne({ name: args.name })
      if (!product)
        throw new GraphQLError("product doesn't exist", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        await ProductModel.findOneAndDelete({ name: args.name })
      } catch (error) {
        throw new GraphQLError('failed to delete product', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return `Successfully deleted ${args.name}`
    },
    uploadProductImage: async (
      _: any,
      { productId, file }: UploadProductImageArgs
    ): Promise<Product> => {
      const { createReadStream, mimetype, filename } = await file

      const stream = createReadStream()
      const chunks: Buffer[] = []

      for await (const chunk of stream) {
        chunks.push(chunk as Buffer)
      }

      const buffer = Buffer.concat(chunks)

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `products/${Date.now().toString()}-${filename}`,
        Body: buffer,
        ContentType: mimetype,
      }

      try {
        const command = new PutObjectCommand(params)
        const res = await getSignedUrl(s3, command)
        console.log('res:', res)

        const updatedProduct: Product | null = await ProductModel.findByIdAndUpdate(
          productId,
          {
            image: {
              key: `products/${Date.now().toString()}-${filename}`,
              bucket: process.env.Bucket,
              mimetype: mimetype,
            },
          },
          { new: true }
        )

        if (!updatedProduct) {
          throw new Error('Product not found')
        }

        return updatedProduct
      } catch (error) {
        throw new GraphQLError('Failed to upload image', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: productId,
            error,
          },
        })
      }
    },
  },
  Product: {
    image: async (
      product: Product
    ): Promise<{ url: string; key: string; bucket: string; mimetype: string } | null> => {
      if (product.image && product.image.key) {
        const getObjectParams = {
          Bucket: product.image.bucket,
          Key: product.image.key,
        }

        try {
          const command = new GetObjectCommand(getObjectParams)
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

          return {
            ...product.image,
            url,
          }
        } catch (error) {
          console.error('Error generating signed URL:', error)
          return null
        }
      }
      return null
    },
  },
}

export default productResolver
