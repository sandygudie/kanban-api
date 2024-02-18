const Column = require('../models/column')
const Board = require('../models/board')

const createAColumn = async (column, boardId) => {
  const verifyBoard = await Board.findOne({ _id: boardId })
  if (!verifyBoard) {
    return null
  }
  const newColumn = column.map(async (col) => {
    const newColumn = await new Column({
      name: col,
      boardId
    })
    const columnArray = await newColumn.save()
    const board = await Board.findOne({ _id: boardId })
    await board.columns.push(columnArray)
    await board.save()
    return newColumn
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
