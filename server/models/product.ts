import mongoose from 'mongoose'
const uniqueValidator = require('mongoose-unique-validator')

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
  components: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComponentModel',
    },
  ],
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationModel',
    index: true,
  },
})

productSchema.plugin(uniqueValidator)

export default mongoose.model('ProductModel', productSchema)
