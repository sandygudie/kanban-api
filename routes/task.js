const Router = require('express')
const {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  assignTask,
  moveTask,
  createTag,
  deleteTag,
  addAttachment,
  deleteAttachment
} = require('../controllers/task')
const multer = require('multer')
const { verifyUser, verifyWorkspaceMember } = require('../middlewares/userChecks')

const taskRouter = Router()
const upload = multer().single('file')
taskRouter.post('/attachment/:taskId', upload, verifyUser, addAttachment)
taskRouter.delete('/attachment/:taskId/:attachmentId', verifyUser, deleteAttachment)
taskRouter.post('/tag/:taskId', verifyUser, createTag)
taskRouter.post('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, createTask)
taskRouter.patch('/:workspaceId/:columnId/:taskId', verifyUser, verifyWorkspaceMember, updateTask)
taskRouter.delete('/:workspaceId/:columnId/:taskId', verifyUser, verifyWorkspaceMember, deleteTask)
taskRouter.get('/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, getTask)
taskRouter.patch('/movetask/:workspaceId', verifyUser, verifyWorkspaceMember, moveTask)
taskRouter.post('/assign-task/:workspaceId/:taskId', verifyUser, verifyWorkspaceMember, assignTask)
taskRouter.delete('/tag/:taskId', verifyUser, deleteTag)

module.exports = { taskRouter }
