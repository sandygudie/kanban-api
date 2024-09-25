const Column = require('../models/column')
const Task = require('../models/task')
const User = require('../models/user')

const createATask = async (reqUser, body, columnId) => {
  const { title, subtasks, description } = body

  const user = await User.findOne({
    _id: reqUser.id
  })
  const isColumnExisting = await Column.findOne({ _id: columnId })
  if (isColumnExisting) {
    const newTask = await new Task({
      title,
      description,
      columnId,
      createdBy: user.name
    })

    newTask.subtasks = subtasks
    newTask.status = isColumnExisting.name
    const taskDetails = await newTask.save()
    const column = await Column.findOne({ _id: columnId })
    column.tasks.splice(0, 0, taskDetails)
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
  const task = await Task.findById(taskId).populate({
    path: 'assignTo',
    select: '_id name profilePics'
  })
  return task
}

const assignATask = async (taskId, reqBody) => {
  const userId = reqBody.userId

  const task = await Task.findById(taskId).populate({
    path: 'assignTo',
    select: '_id name profilePics'
  })

  const isUserExisting = task.assignTo.find((user) => user._id.toString() === userId)
  if (isUserExisting) {
    task.assignTo = task.assignTo.filter((ele) => ele._id.toString() !== userId)
  } else {
    task.assignTo = task.assignTo.concat(userId)
  }
  await task.save()
  return task
}

const moveATask = async (reqBody) => {
  const { columnId, taskId, position } = reqBody

  const task = await Task.findById(taskId)
  const sourceColumnId = task.columnId
  await Column.findByIdAndUpdate(sourceColumnId, { $pull: { tasks: taskId } })

  const column = await Column.findOne({ _id: columnId })
  task.columnId = columnId
  task.status = column.name
  const taskDetails = await task.save()
  column.tasks.splice(position || 0, 0, taskDetails)
  await column.save()
  return task
}

const addTaskTag = async (reqbody, taskId) => {
  const task = await Task.findById(taskId)
  task.tags = task.tags.concat(reqbody)
  await task.save()
  return task
}
const deleteTaskTag = async (tag, taskId) => {
  const task = await Task.findById({
    _id: taskId
  })
  task.tags = task.tags.filter((ele) => ele.name !== tag.name)
  await task.save()
  return task
}

const addAttachmentService = async (payload, taskId) => {
  const task = await Task.findById({
    _id: taskId
  })

  task.attachments = task.attachments.concat(payload)
  await task.save()
  return task
}

const deleteAttachmentService = async (attachmentId, taskId) => {
  const task = await Task.findById({
    _id: taskId
  })
  const filteredArr = task.attachments.filter((ele) => ele._id.toString() !== attachmentId)
  task.attachments = filteredArr
  await task.save()
  return task
}

module.exports = {
  createATask,
  updateATask,
  deleteATask,
  getATask,
  assignATask,
  moveATask,
  addTaskTag,
  deleteTaskTag,
  addAttachmentService,
  deleteAttachmentService
}
