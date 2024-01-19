const Router = require('express')
const {
  createWorkspace,
  getUserWorkspaces,
  getUserWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMemberWorkspace
} = require('../controllers/workspace')
const { verifyUser } = require('../middlewares/userChecks')

const workspaceRouter = Router()
workspaceRouter.post('/:workspaceId', createWorkspace)
workspaceRouter.get('/:workspaceId', verifyUser, getUserWorkspaces)
workspaceRouter.get('/:workspaceId', verifyUser, getUserWorkspace)
workspaceRouter.patch('/:workspaceId', updateWorkspace)
workspaceRouter.delete('/:workspaceId', verifyUser, deleteWorkspace)

workspaceRouter.patch('addmember/:workspaceId', verifyUser, addMemberWorkspace) // give them workspace id and name

module.exports = { workspaceRouter }
