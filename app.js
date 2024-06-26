const express = require('express')
const cors = require('cors')
const { connectToDB } = require('./db/db')
const middleware = require('./middlewares/error-handler')
const apiRouter = require('./routes')
const cookieParser = require('cookie-parser')
const { APP_HOSTNAME } = require('./config')
const useragent = require('express-useragent')
const app = express()

const corsOptions = {
  origin: APP_HOSTNAME,
  credentials: true
}

app.use(cors(corsOptions))
connectToDB()
app.use(useragent.express())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Kanban!.' }))
app.use('/api/v1', apiRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.defaultErrorHandler)

module.exports = app
