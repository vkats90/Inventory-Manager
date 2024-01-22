import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  cost: Number,
  price: Number,
  SKU: {
    type: String,
    required: true,
  },
  subComponents: [String],
})

module.exports = mongoose.model('Product', productSchema)
