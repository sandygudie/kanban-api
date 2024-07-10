const { errorResponse, successResponse } = require('../utils/responseHandler')
const { taskValidation, tagValidation } = require('../utils/validators')
const {
  createATask,
  updateATask,
  deleteATask,
  assignATask,
  getATask,
  moveATask,
  addTaskTag,
  deleteTaskTag
} = require('../services/task')

const createTask = async (req, res) => {
  const { error } = taskValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const taskDetails = await createATask(req.user, req.body, req.params.columnId)
    if (!taskDetails) {
      return errorResponse(res, 400, 'No Column existing')
    }
    return successResponse(res, 201, 'Task created!', {
      taskId: taskDetails._id,
      columnId: taskDetails.columnId
    })
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const updateTask = async (req, res) => {
  try {
    const updatedTask = await updateATask(req.params.taskId, req.body)
    if (!updatedTask) {
      return errorResponse(res, 400, 'Error updating task')
    }
    return successResponse(res, 201, 'Task updated!', updatedTask)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const deleteTask = async (req, res) => {
  try {
    const updatedTask = await deleteATask(req.params)
    if (!updatedTask) {
      return errorResponse(res, 400, 'Error deleting task')
    }
    return successResponse(res, 200, 'Task Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const getTask = async (req, res) => {
  try {
    const task = await getATask(req.params.taskId)
    if (!task) {
      return errorResponse(res, 400, 'Error retriving task')
    }
    return successResponse(res, 200, 'Task retrieved', task)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
const assignTask = async (req, res) => {
  try {
    const task = await assignATask(req.params.taskId, req.body)
    if (!task) {
      return errorResponse(res, 400, 'Error assigning task to user')
    }
    return successResponse(res, 200, 'Task assigned', task)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
const moveTask = async (req, res) => {
  try {
    const task = await moveATask(req.body)
    if (!task) {
      return errorResponse(res, 400, 'Error moving task')
    }
    return successResponse(res, 200, 'Task assigned', task)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const createTag = async (req, res) => {
  const { error } = tagValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    await addTaskTag(req.body, req.params.taskId)
    return successResponse(res, 201, 'New Tag created!')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const deleteTag = async (req, res) => {
  try {
    await deleteTaskTag(req.body, req.params.taskId)
    return successResponse(res, 200, 'Tag deleted!')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  assignTask,
  moveTask,
  createTag,
  deleteTag
}
