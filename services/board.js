const Board = require('../models/board')
const Column = require('../models/column')
const Workspace = require('../models/workspace')

const createABoard = async (body, workspaceId) => {
  const { name, column } = body
  const newBoard = await new Board({
    name,
    workspaceId
  })
  const boardDetails = await newBoard.save()

  const workspace = await Workspace.findOne({ _id: boardDetails.workspaceId })
  workspace.boards.push(boardDetails._id)
  await workspace.save()

  await column.map((col) => {
    return Column.create({
      name: col,
      boardId: newBoard._id
    })
  })
  return newBoard
}

const allBoards = async (workspaceId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId
  }).populate({ path: 'boards', select: '_id name' })
  return workspace.boards
}

const updateABoard = async (boardId, body) => {
  const updatedBoard = await Board.findByIdAndUpdate(boardId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return updatedBoard
}

const deleteABoard = async (params) => {
  const { workspaceId, boardId } = params
  const updatedBoard = await Board.findByIdAndDelete(boardId)
  await Column.deleteMany({ boardId })
  await Workspace.updateOne({ _id: workspaceId }, { $pull: { boards: boardId } })
  return updatedBoard
}

module.exports = {
  createABoard,
  allBoards,
  updateABoard,
  deleteABoard
}
