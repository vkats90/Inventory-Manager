import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  address: String,
})

locationSchema.plugin(uniqueValidator)

export default mongoose.model('LocationModel', locationSchema)
