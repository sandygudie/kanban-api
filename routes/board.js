const Router = require('express')
const {
  createBoard,
  getWorkspaceBoards,
  updateBoard,
  deleteBoard,
  getBoard
} = require('../controllers/board')
const {
  verifyUser,
  verifyWorkspaceAdmin,
  verifyWorkspaceMember
} = require('../middlewares/userChecks')

const boardRouter = Router()
boardRouter.post('/:workspaceId', verifyUser, verifyWorkspaceMember, createBoard)
boardRouter.get('/:workspaceId', verifyUser, verifyWorkspaceMember, getWorkspaceBoards)
boardRouter.get('/:workspaceId/:boardId', verifyUser, verifyWorkspaceMember, getBoard)
boardRouter.patch('/:workspaceId/:boardId', verifyUser, verifyWorkspaceMember, updateBoard)
boardRouter.delete('/:workspaceId/:boardId', verifyUser, verifyWorkspaceAdmin, deleteBoard)

module.exports = { boardRouter }
