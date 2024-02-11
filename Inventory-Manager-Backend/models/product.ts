import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
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
})

export default mongoose.model('ProductModel', productSchema)
