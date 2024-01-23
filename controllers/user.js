const { getAllUserWorkspaces } = require('../services/user')
const { errorResponse, successResponse } = require('../utils/responseHandler')

const getUserWorkspaces = async (req, res) => {
  try {
    const userWorkspaces = await getAllUserWorkspaces(req.user.id)
    return successResponse(res, 200, 'User workspaces retrieved!', userWorkspaces)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

// you can delete your account as an admin unless you assign the role to someone

module.exports = {
  getUserWorkspaces
}
