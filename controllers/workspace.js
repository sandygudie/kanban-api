const Workspace = require('../models/workspace')
const User = require('../models/user')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { workspaceValidation } = require('../utils/validators')
const { createWorkspaceAccount, getAllUserWorkspaces } = require('../services/workspace')

// check if user exist check, if workspace exist
const createWorkspace = async (req, res) => {
  const { error } = workspaceValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const user = await User.findOne({
      _id: req.user.id
    })
    if (user) {
      const workspaceDetails = await createWorkspaceAccount(user, Workspace, req.body)
      return successResponse(res, 201, 'Workspace Created!', workspaceDetails._id)
    } else {
      return errorResponse(res, 400, 'Invalid Request')
    }
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
const getAWorkspace = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id
    })
    const userWorkspaces = getAllUserWorkspaces(user)
    return successResponse(res, 200, 'Workspaces retrieved!', userWorkspaces)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

module.exports = {
  createWorkspace,
  getAWorkspace
}
