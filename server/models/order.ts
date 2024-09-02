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
  created_on: Date,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  updated_on: Date,
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocationModel',
    index: true,
  },
})

export default mongoose.model('OrderModel', orderSchema)
