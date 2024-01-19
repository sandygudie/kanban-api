const express = require('express')
const apiRouter = express.Router()

const { authRouter } = require('./auth')
const { workspaceRouter } = require('./workspace')

apiRouter.use('/auth', authRouter)
apiRouter.use('/workspace', workspaceRouter)

module.exports = apiRouter
