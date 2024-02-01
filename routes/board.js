const Router = require('express')
const {
  createBoard,
  getWorkspaceBoards,
  updateBoard,
  deleteBoard
} = require('../controllers/board')
const {
  verifyUser,
  verifyWorkspaceAdmin,
  verifyWorkspaceMember
} = require('../middlewares/userChecks')

const boardRouter = Router()
boardRouter.post('/:workspaceId', verifyUser, verifyWorkspaceAdmin, createBoard)
boardRouter.get('/:workspaceId', verifyUser, verifyWorkspaceMember, getWorkspaceBoards)
boardRouter.patch('/:workspaceId/:boardId', verifyUser, verifyWorkspaceAdmin, updateBoard)
boardRouter.delete('/:workspaceId/:boardId', verifyUser, verifyWorkspaceAdmin, deleteBoard)

module.exports = { boardRouter }
