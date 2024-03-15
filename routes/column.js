const Router = require('express')
const { createColumn, updateColumn, deleteColumn, getColumn } = require('../controllers/column')
const { verifyUser, verifyWorkspaceMember } = require('../middlewares/userChecks')

const columnRouter = Router()

columnRouter.post('/:workspaceId/:boardId', verifyUser, verifyWorkspaceMember, createColumn)
columnRouter.patch('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, updateColumn)
columnRouter.delete('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, deleteColumn)
columnRouter.get('/:workspaceId/:columnId', verifyUser, verifyWorkspaceMember, getColumn)

module.exports = { columnRouter }
