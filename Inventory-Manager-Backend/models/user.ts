import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  name: String,
  stores: [String],
  passwordHash: {
    type: String,
  },
})

schema.plugin(uniqueValidator)

export default mongoose.model('UserModel', schema)
