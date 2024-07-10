const Router = require('express')
const {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  assignTask,
  moveTask,
  createTag,
  deleteTag
} = require('../controllers/task')
const { verifyUser, verifyWorkspaceMember } = require('../middlewares/userChecks')

const taskRouter = Router()

taskRouter.post('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, createTask)
taskRouter.post('/tag/:taskId', verifyUser, createTag)
taskRouter.patch('/:workspaceId/:columnId/:taskId', verifyUser, verifyWorkspaceMember, updateTask)
taskRouter.delete('/:workspaceId/:columnId/:taskId', verifyUser, verifyWorkspaceMember, deleteTask)
taskRouter.get('/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, getTask)
taskRouter.patch('/movetask/:workspaceId', verifyUser, verifyWorkspaceMember, moveTask)
taskRouter.post('/assign-task/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, assignTask)
taskRouter.delete('/tag/:taskId', verifyUser, deleteTag)

module.exports = { taskRouter }
