const Column = require('../models/column')
const Task = require('../models/task')

const createATask = async (body, columnId) => {
  const { title, subtasks, description, assignTo, deadline } = body
  const isColumnExisting = await Column.findOne({ _id: columnId })
  if (isColumnExisting) {
    const newTask = await new Task({
      title,
      description,
      assignTo,
      deadline,
      columnId
    })

    newTask.subtasks = subtasks
    newTask.status = isColumnExisting.name
    const taskDetails = await newTask.save()

    const column = await Column.findOne({ _id: columnId })
    column.tasks.push(taskDetails)
    await column.save()
    return taskDetails
  } else {
    return null
  }
}

const updateATask = async (taskId, body) => {
  const updatedTask = await Task.findByIdAndUpdate(taskId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return updatedTask
}

const deleteATask = async (params) => {
  const { columnId, taskId } = params
  const isColumnExisting = await Column.findOne({ _id: columnId })
  if (isColumnExisting) {
    const updatedColumn = await Column.findByIdAndUpdate(columnId, { $pull: { tasks: taskId } })
    await Task.findOneAndDelete({ _id: taskId })
    return updatedColumn
  } else {
    return null
  }
}

const getATask = async (taskId) => {
  const task = await Task.findById(taskId)
  return task
}

module.exports = {
  createATask,
  updateATask,
  deleteATask,
  getATask
}
