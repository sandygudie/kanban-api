const { getAllUserWorkspaces, updateAUser, deleteAUser } = require('../services/user')
const { errorResponse, successResponse } = require('../utils/responseHandler')

const getUserWorkspaces = async (req, res) => {
  console.log(req.user)
  try {
    const userWorkspaces = await getAllUserWorkspaces(req.user.id)
    return successResponse(res, 200, 'User workspaces retrieved!', userWorkspaces)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateAUser(req.params.userId, req.body)
    if (!updatedUser) {
      return errorResponse(res, 400, 'Error updating user')
    }
    return successResponse(res, 200, 'User Updated!')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const deleteUser = async (req, res) => {
  try {
    const updatedUser = await deleteAUser(req.params)
    if (!updatedUser) {
      return errorResponse(res, 400, 'Error deleting task')
    }
    return successResponse(res, 200, 'Task Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

// you can delete your account as an admin unless you assign the role to someone

module.exports = {
  getUserWorkspaces,
  updateUser,
  deleteUser
}
