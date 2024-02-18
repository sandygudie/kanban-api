const Router = require('express')
const { createTask, updateTask, deleteTask, getTask } = require('../controllers/task')
const { verifyUser, verifyWorkspaceMember } = require('../middlewares/userChecks')

const taskRouter = Router()

taskRouter.post('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, createTask)
taskRouter.patch('/:workspaceId/:columnId/:taskId', verifyUser, verifyWorkspaceMember, updateTask)
taskRouter.delete('/:workspaceId/:columnId/:taskId', verifyUser, verifyWorkspaceMember, deleteTask)
taskRouter.get('/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, getTask)
module.exports = { taskRouter }
