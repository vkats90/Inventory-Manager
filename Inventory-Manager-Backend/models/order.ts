import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  priority: Number,
  status: String,
})

export default mongoose.model('OrderModel', orderSchema)
