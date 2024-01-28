import mongoose from 'mongoose'

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
})

module.exports = mongoose.model('ComponentModel', componentSchema)
