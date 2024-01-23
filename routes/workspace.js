const Router = require('express')
const {
  createWorkspace,
  getAWorkspace,
  updateAWorkspace,
  addWorkspaceMember,
  //   deleteWorkspace,
  joinWorkspace,
  deleteMemberWorkspace
} = require('../controllers/workspace')
const { verifyUser, verifyIsUserAdmin } = require('../middlewares/userChecks')

const workspaceRouter = Router()
workspaceRouter.post('/', verifyUser, createWorkspace)
workspaceRouter.get('/:workspaceId', verifyUser, getAWorkspace) // you have to be part of the work space to be able to retrieved
workspaceRouter.patch('/:workspaceId', verifyUser, verifyIsUserAdmin, updateAWorkspace)
workspaceRouter.patch('/addmember/:workspaceId', verifyUser, verifyIsUserAdmin, addWorkspaceMember)
// workspaceRouter.delete('/:workspaceId', verifyUser, deleteWorkspace)
workspaceRouter.post('/join-workspace', verifyUser, joinWorkspace)
workspaceRouter.delete(
  '/delete-member/:workspaceId/:userId',
  verifyUser,
  verifyIsUserAdmin,
  deleteMemberWorkspace
)
module.exports = { workspaceRouter }

// update workspace
// i have to be an admin of that workspace to update a workspace , test that other admins cannot update other people workspace.
