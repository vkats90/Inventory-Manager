import mongoose from 'mongoose'

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

export default mongoose.model('ComponentModel', componentSchema)
