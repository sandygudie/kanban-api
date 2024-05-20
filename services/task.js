const Column = require('../models/column')
const Task = require('../models/task')
const User = require('../models/user')
const mongoose = require('mongoose')

const createATask = async (reqUser, body, columnId) => {
  const { title, subtasks, description, position, taskId } = body
  const Id = taskId || new mongoose.Types.ObjectId()

  const user = await User.findOne({
    _id: reqUser.id
  })
  const isColumnExisting = await Column.findOne({ _id: columnId })
  if (isColumnExisting) {
    const newTask = await new Task({
      _id: Id,
      title,
      description,
      columnId,
      createdBy: user.name
    })

    newTask.subtasks = subtasks
    newTask.status = isColumnExisting.name
    const taskDetails = await newTask.save()
    const column = await Column.findOne({ _id: columnId })
    column.tasks.splice(position || 0, 0, taskDetails)
    await column.save()
    return taskDetails
  } else {
    return null
  }
}

const updateATask = async (taskId, body) => {
  const updatedTask = Task.findByIdAndUpdate(taskId, body, {
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
const assignATask = async (taskId, reqBody) => {
  const task = await Task.findById(taskId)
  const isUserExisting = task.assignTo.find((user) => user.name === reqBody.name)
  if (isUserExisting) {
    task.assignTo = task.assignTo.filter((ele) => ele.name !== isUserExisting.name)
  } else {
    task.assignTo = task.assignTo.concat(reqBody)
  }

  await task.save()
  return task
}

module.exports = {
  createATask,
  updateATask,
  deleteATask,
  getATask,
  assignATask
}
