const Router = require('express')
const {
  createWorkspace,
  getAWorkspace,
  updateAWorkspace,
  addWorkspaceMember,
  deleteWorkspace,
  joinWorkspace,
  deleteMemberWorkspace
} = require('../controllers/workspace')
const { verifyUser, verifyWorkspaceAdmin } = require('../middlewares/userChecks')

const workspaceRouter = Router()
workspaceRouter.post('/', verifyUser, createWorkspace)
workspaceRouter.get('/:workspaceId', verifyUser, getAWorkspace)
workspaceRouter.patch('/:workspaceId', verifyUser, verifyWorkspaceAdmin, updateAWorkspace)
workspaceRouter.patch(
  '/addmember/:workspaceId',
  verifyUser,
  verifyWorkspaceAdmin,
  addWorkspaceMember
)
workspaceRouter.delete('/:workspaceId', verifyUser, verifyWorkspaceAdmin, deleteWorkspace)
workspaceRouter.post('/join-workspace', verifyUser, joinWorkspace)
workspaceRouter.delete(
  '/delete-member/:workspaceId/:userId',
  verifyUser,
  verifyWorkspaceAdmin,
  deleteMemberWorkspace
)
module.exports = { workspaceRouter }
