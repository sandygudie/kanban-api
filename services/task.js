const Column = require('../models/column')
const Task = require('../models/task')

const createATask = async (body, columnId) => {
  const { title, subtasks, description, assignTo, deadline } = body
  const newTask = await new Task({
    title,
    description,
    assignTo,
    deadline,
    columnId
  })
  newTask.subtasks.push(subtasks)
  const taskDetails = await newTask.save()
  return taskDetails
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
  const updatedTask = await Task.findByIdAndDelete(taskId)
  await Column.updateOne({ _id: columnId }, { $pull: { tasks: taskId } })
  return updatedTask
}

module.exports = {
  createATask,
  updateATask,
  deleteATask
}
