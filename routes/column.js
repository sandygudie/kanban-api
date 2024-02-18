const Router = require('express')
const { createColumn, updateColumn, deleteColumn, getColumn } = require('../controllers/column')
const { verifyUser, verifyWorkspaceAdmin } = require('../middlewares/userChecks')

const columnRouter = Router()

columnRouter.post('/:workspaceId/:boardId', verifyUser, verifyWorkspaceAdmin, createColumn)
columnRouter.patch('/:workspaceId/:columnId', verifyUser, verifyWorkspaceAdmin, updateColumn)
columnRouter.delete('/:workspaceId/:columnId', verifyUser, verifyWorkspaceAdmin, deleteColumn)
columnRouter.get('/:workspaceId/:columnId', verifyUser, verifyWorkspaceAdmin, getColumn)

module.exports = { columnRouter }
