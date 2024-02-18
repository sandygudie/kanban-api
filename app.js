const express = require('express')
const cors = require('cors')
const { connectToDB } = require('./db/db')
const middleware = require('./middlewares/error-handler')
const apiRouter = require('./routes')
const cookieParser = require('cookie-parser')

const app = express()

connectToDB()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Kanban.' }))
app.use('/api/v1', apiRouter)

// middleware;
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.defaultErrorHandler)

module.exports = app
