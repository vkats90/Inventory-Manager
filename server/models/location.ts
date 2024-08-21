import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  read: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserModel',
  },
  write: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserModel',
  },
})

locationSchema.plugin(uniqueValidator)
