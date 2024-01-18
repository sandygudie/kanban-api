const mongoose = require('mongoose')

const { MONGODB_URI } = require('../config')

const connectToDB = async () => {
  await mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Database connected successfully')
    })
    .catch((error) => {
      console.error('error connecting to MongoDB:', error.message)
    })
}

const disconnectDB = async () => {
  await mongoose.disconnect()
}

module.exports = { connectToDB, disconnectDB }
