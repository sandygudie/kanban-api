const express = require('express')
const cors = require('cors')
const { connectToDB } = require('./db/db')
const middleware = require('./middlewares/error-handler')
const apiRouter = require('./routes')

const app = express()

connectToDB()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Kanban.' }))
app.use('/api/v1', apiRouter)

// middleware;
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.defaultErrorHandler)

module.exports = app
