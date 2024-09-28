import mongoose from 'mongoose'

const uniqueValidator = require('mongoose-unique-validator')

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  cost: Number,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationModel',
    index: true,
  },
})

componentSchema.plugin(uniqueValidator)

export default mongoose.model('ComponentModel', componentSchema)
