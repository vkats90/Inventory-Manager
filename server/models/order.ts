import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType',
  },
  itemType: {
    type: String,
    enum: ['ComponentModel', 'ProductModel'],
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
  supplier: String,
})

export default mongoose.model('OrderModel', orderSchema)
