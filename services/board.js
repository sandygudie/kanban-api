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

  column.map(async (col) => {
    const newColumn = await new Column({
      name: col,
      boardId: newBoard._id
    })
    const columnArray = await newColumn.save()
    const board = await Board.findOne({ _id: boardDetails._id })
    await board.columns.push(columnArray)
    await board.save()
  })
  return newBoard
}

const allBoards = async (workspaceId) => {
  const workspace = await Workspace.findById({
    _id: workspaceId
  }).populate({
    path: 'boards',
    select: '_id name columns',
    populate: {
      path: 'columns',
      select: '_id name tasks',
      populate: {
        path: 'tasks'
        // select: '_id title subtasks'
      }
    }
  })
  return workspace
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
