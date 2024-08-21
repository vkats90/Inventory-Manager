import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  cost: Number,
})

componentSchema.plugin(uniqueValidator)

export default mongoose.model('ComponentModel', componentSchema)
