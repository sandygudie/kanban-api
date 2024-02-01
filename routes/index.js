const express = require('express')
const apiRouter = express.Router()

const { authRouter } = require('./auth')
const { workspaceRouter } = require('./workspace')
const { userRouter } = require('./user')
const { boardRouter } = require('./board')
const { columnRouter } = require('./column')
const { taskRouter } = require('./task')

apiRouter.use('/auth', authRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/workspace', workspaceRouter)
apiRouter.use('/board', boardRouter)
apiRouter.use('/column', columnRouter)
apiRouter.use('/task', taskRouter)

module.exports = apiRouter
