import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI

const StartDB = async () => {
  await mongoose
    .connect(MONGODB_URI as string)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connection to MongoDB:', error.message)
    })
}

export const KillDB = async () => {
  await mongoose.connection.close()
}

export default StartDB
