const Router = require('express')
const { createTask, updateTask, deleteTask } = require('../controllers/task')
const { verifyUser, verifyWorkspaceMember } = require('../middlewares/userChecks')

const taskRouter = Router()

taskRouter.post('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, createTask)
taskRouter.patch('/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, updateTask)
taskRouter.delete('/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, deleteTask)

module.exports = { taskRouter }
