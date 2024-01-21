const express = require('express')
const apiRouter = express.Router()

const { authRouter } = require('./auth')
const { workspaceRouter } = require('./workspace')
const { userRouter } = require('./user')

apiRouter.use('/auth', authRouter)
apiRouter.use('/workspace', workspaceRouter)
apiRouter.use('/user', userRouter)

module.exports = apiRouter
