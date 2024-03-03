const Router = require('express')
const {
  createWorkspace,
  getAWorkspace,
  updateAWorkspace,
  addWorkspaceMember,
  deleteWorkspace,
  joinWorkspace,
  deleteMemberWorkspace,
  removeMemberPending,
  updateMemberRole
} = require('../controllers/workspace')
const { verifyUser, verifyWorkspaceAdmin } = require('../middlewares/userChecks')

const workspaceRouter = Router()
workspaceRouter.post('/', verifyUser, createWorkspace)
workspaceRouter.get('/:workspaceId', verifyUser, getAWorkspace)
workspaceRouter.patch('/:workspaceId', verifyUser, verifyWorkspaceAdmin, updateAWorkspace)
workspaceRouter.delete('/:workspaceId', verifyUser, verifyWorkspaceAdmin, deleteWorkspace)
workspaceRouter.post('/join-workspace', verifyUser, joinWorkspace)
workspaceRouter.patch(
  '/addmember/:workspaceId',
  verifyUser,
  verifyWorkspaceAdmin,
  addWorkspaceMember
)
workspaceRouter.delete(
  '/delete-member/:workspaceId/:userId',
  verifyUser,
  verifyWorkspaceAdmin,
  deleteMemberWorkspace
)
workspaceRouter.delete(
  '/delete-pendingmember/:workspaceId/:userEmail',
  verifyUser,
  verifyWorkspaceAdmin,
  removeMemberPending
)
workspaceRouter.patch(
  '/assign-admin/:workspaceId/:userId',
  verifyUser,
  verifyWorkspaceAdmin,
  updateMemberRole
)
module.exports = { workspaceRouter }
