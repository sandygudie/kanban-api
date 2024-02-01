const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/responseHandler')
const { ACCESS_TOKEN_JWT_SECRET } = require('../config')
const { verifyWorkspace } = require('./workspaceChecks')
const User = require('../models/user')

const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    return errorResponse(res, 401, 'Unauthorized')
  }
  try {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_JWT_SECRET)
    req.user = decodedToken

    // key points: what if you delete your user from the database, that user can continue making request because he was existing on his last login, his subsequent request is just verifying with the jwt secrets
    // he will be only get to be unauthorized on his next login
    // this extra database check is to ensure the user is unauthorized on his next request
    // could this be one reason we have refresh token
    const user = await User.findOne({
      _id: req.user.id
    })
    if (user) {
      return next()
    } else {
      return errorResponse(res, 401, 'User not found')
    }
  } catch {
    return errorResponse(res, 401, 'Unauthorized')
  }
}

const verifyWorkspaceAdmin = async (req, res, next) => {
  const workspace = await verifyWorkspace(req.params.workspaceId)
  if (!workspace) {
    return errorResponse(res, 401, 'No exisitng workspace')
  }
  if (workspace.workspaceAdmin === req.user.id) {
    return next()
  } else {
    return errorResponse(res, 401, 'Unauthorized')
  }
}
const verifyWorkspaceMember = async (req, res, next) => {
  const workspace = await verifyWorkspace(req.params.workspaceId)
  if (!workspace) {
    return errorResponse(res, 401, 'No exisitng workspace')
  }
  const isWorkspaceMember = workspace.members.find((ele) => ele.userId === req.user.id)
  if (isWorkspaceMember) {
    return next()
  } else {
    return errorResponse(res, 401, 'Unauthorized')
  }
}

module.exports = { verifyUser, verifyWorkspaceAdmin, verifyWorkspaceMember }
