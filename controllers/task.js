const { errorResponse, successResponse } = require('../utils/responseHandler')
const { taskValidation } = require('../utils/validators')
const { createATask, updateATask, deleteATask, getATask } = require('../services/task')

const createTask = async (req, res) => {
  const { error } = taskValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const taskDetails = await createATask(req.body, req.params.columnId)
    if (!taskDetails) {
      return errorResponse(res, 400, 'No Column existing')
    }
    return successResponse(res, 201, 'Task created!', { taskId: taskDetails })
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
    return successResponse(res, 200, 'Task retrieved')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTask
}
