const Board = require('../models/board')
const Column = require('../models/column')
const Workspace = require('../models/workspace')
const User = require('../models/user')

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

  const columnArray = await Promise.all(
    column.map((col) =>
      Column.create({
        name: col,
        boardId: newBoard._id
      })
    )
  )

  const board = await Board.findOne({ _id: boardDetails._id })
  columnArray.map(async (col) => {
    await board.columns.push(col)
  })
  await board.save()

  const columns = columnArray.map((ele) => {
    return { name: ele.name, _id: ele._id, tasks: [] }
  })

  return { newBoard, columns }
}

const allBoards = async (reqUser, workspaceId) => {
  const { id } = reqUser
  const user = await User.findOne({
    _id: id
  })
  const workspace = await Workspace.findById({
    _id: workspaceId
  }).populate({
    path: 'boards',
    select: '_id name columns description createdAt',
    populate: {
      path: 'columns',
      populate: {
        path: 'tasks',
        options: { sort: { updatedAt: -1 } }
      }
    }
  })
  const userDetails = {
    userid: user._id,
    username: user.name,
    profilePics: user.profilePics,
    email: user.email
  }
  return { workspace, userDetails }
}

const getABoard = async (boardId) => {
  const board = await Board.findOne({ _id: boardId }).populate({
    path: 'columns',
    populate: {
      path: 'tasks'
    }
  })
  return board
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
  deleteABoard,
  getABoard
}
