const Router = require('express')
const { getUserWorkspaces, updateUser, deleteUser } = require('../controllers/user')
const { verifyUser } = require('../middlewares/userChecks')

const userRouter = Router()
userRouter.get('/', verifyUser, getUserWorkspaces)
userRouter.patch('/:userId', verifyUser, updateUser)
userRouter.delete('/:workspaceId/userId', verifyUser, deleteUser)

module.exports = { userRouter }
