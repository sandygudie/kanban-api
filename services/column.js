const Column = require('../models/column')
const Board = require('../models/board')

const createAColumn = async (column, boardId) => {
  const verifyBoard = await Board.findOne({ _id: boardId })
  if (!verifyBoard) {
    return null
  }

  const newColumn = await Promise.all(
    column.map((col) =>
      Column.create({
        name: col,
        boardId
      })
    )
  )
  const board = await Board.findOne({ _id: boardId })
  newColumn.map(async (col) => {
    await board.columns.push(col)
  })
  await board.save()
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

const getAColumn = async (columnId) => {
  const column = await Column.findById(columnId).populate({
    path: 'tasks'
  })
  return column
}

module.exports = {
  createAColumn,
  updateAColumn,
  deleteAColumn,
  getAColumn
}
