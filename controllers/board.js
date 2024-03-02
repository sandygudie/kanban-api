const { errorResponse, successResponse } = require('../utils/responseHandler')
const { boardValidation } = require('../utils/validators')
const {
  createABoard,
  allBoards,
  updateABoard,
  deleteABoard,
  getABoard
} = require('../services/board')

const createBoard = async (req, res) => {
  const { error } = boardValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const boardDetails = await createABoard(req.body, req.params.workspaceId)
    return successResponse(res, 201, 'Board Created!', { boardId: boardDetails._id })
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const getWorkspaceBoards = async (req, res) => {
  try {
    const workspaceBoards = await allBoards(req.user, req.params.workspaceId)
    if (!workspaceBoards) {
      return errorResponse(res, 400, 'Error retriving board')
    }
    const temp = workspaceBoards
    return successResponse(res, 201, 'Workspace boards retrieved!', temp)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
const getBoard = async (req, res) => {
  try {
    const board = await getABoard(req.params.boardId)
    if (!board) {
      return errorResponse(res, 400, 'Error retriving board')
    }
    return successResponse(res, 201, 'Board retrieved!', board)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const updateBoard = async (req, res) => {
  try {
    const updatedBoard = await updateABoard(req.params.boardId, req.body)
    if (!updatedBoard) {
      return errorResponse(res, 400, 'Error updating board')
    }
    return successResponse(res, 201, 'Workspace board updated!', updatedBoard)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const deleteBoard = async (req, res) => {
  try {
    const updatedBoard = await deleteABoard(req.params)
    if (!updatedBoard) {
      return errorResponse(res, 400, 'Error deleting board')
    }
    return successResponse(res, 200, 'Board Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

module.exports = {
  createBoard,
  getWorkspaceBoards,
  updateBoard,
  getBoard,
  deleteBoard
}
