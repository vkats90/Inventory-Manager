import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  passwordHash: {
    type: String,
  },
})

schema.plugin(uniqueValidator)

export default mongoose.model('UserModel', schema)
