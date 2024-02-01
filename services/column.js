const Column = require('../models/column')
const Board = require('../models/board')

const createAColumn = async (name, boardId) => {
  const verifyBoard = await Board.findOne({ _id: boardId })
  if (!verifyBoard) {
    return null
  }
  const newColumn = await Column.create({
    name,
    boardId
  })
  return newColumn
}

const updateAColumn = async (columnId, body) => {
  const updatedColumn = await Column.findByIdAndUpdate(columnId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return updatedColumn
}

const deleteAColumn = async (params) => {
  const { columnId, boardId } = params
  const updatedColumn = await Column.findByIdAndDelete(columnId)
  await Board.updateOne({ _id: boardId }, { $pull: { columns: columnId } })
  return updatedColumn
}

module.exports = {
  createAColumn,
  updateAColumn,
  deleteAColumn
}
