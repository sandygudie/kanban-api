const { errorResponse, successResponse } = require('../utils/responseHandler')
const { columnValidation } = require('../utils/validators')
const { createAColumn, updateAColumn, deleteAColumn } = require('../services/column')

const createColumn = async (req, res) => {
  const { error } = columnValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const columnDetails = await createAColumn(req.body.name, req.params.boardId)
    if (!columnDetails) {
      return errorResponse(res, 400, 'Error creating column')
    }
    return successResponse(res, 201, 'Column created!', { columnId: columnDetails._id })
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const updateColumn = async (req, res) => {
  try {
    const updatedColumn = await updateAColumn(req.params.columnId, req.body)
    if (!updatedColumn) {
      return errorResponse(res, 400, 'Error updating column or column does not exist')
    }
    return successResponse(res, 201, 'Column updated!', updatedColumn)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const deleteColumn = async (req, res) => {
  try {
    const updatedColumn = await deleteAColumn(req.params)
    if (!updatedColumn) {
      return errorResponse(res, 400, 'Error deleting column or column does not exist')
    }
    return successResponse(res, 200, 'Column Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

module.exports = {
  createColumn,
  updateColumn,
  deleteColumn
}
