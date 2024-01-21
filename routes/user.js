const Router = require('express')
const {
  getUserWorkspaces
  //   getUserWorkspace,
  //   updateWorkspace,
  //   deleteWorkspace,
  //   addMemberWorkspace
} = require('../controllers/user')
const { verifyUser } = require('../middlewares/userChecks')

const userRouter = Router()
userRouter.get('/', verifyUser, getUserWorkspaces)
// workspaceRouter.get('/:workspaceId', verifyUser, getUserWorkspaces)
// workspaceRouter.get('/:workspaceId', verifyUser, getUserWorkspace)
// workspaceRouter.patch('/:workspaceId', updateWorkspace)
// workspaceRouter.delete('/:workspaceId', verifyUser, deleteWorkspace)

// workspaceRouter.patch('addmember/:workspaceId', verifyUser, addMemberWorkspace) // give them workspace id and name

module.exports = { userRouter }
