const { errorResponse, successResponse } = require('../utils/responseHandler')
const { taskValidation } = require('../utils/validators')
const { createATask, updateATask, deleteATask } = require('../services/task')

const createTask = async (req, res) => {
  const { error } = taskValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const taskDetails = await createATask(req.body, req.params.columnId)
    return successResponse(res, 201, 'Task created!', { taskId: taskDetails._id })
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
    const updatedTask = await deleteATask(req.params.taskId)
    if (!updatedTask) {
      return errorResponse(res, 400, 'Error deleting task')
    }
    return successResponse(res, 200, 'Task Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask
}
