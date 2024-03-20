const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/responseHandler')
const { ACCESS_TOKEN_JWT_SECRET } = require('../config')
const { verifyWorkspace } = require('./workspaceChecks')
const User = require('../models/user')

const verifyUser = async (req, res, next) => {
  let token
  if (req.useragent.isMobile === true) {
    const bearerToken = req.headers.authorization
    if (!bearerToken || !(bearerToken.search('Bearer ') === 0)) {
      return errorResponse(res, 401, 'Unauthorized')
    }
    token = bearerToken.split(' ')[1]
  } else {
    token = req.cookies.access_token
  }
  if (!token) {
    return errorResponse(res, 401, 'Unauthorized')
  }

  try {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_JWT_SECRET)
    req.user = decodedToken
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
    return errorResponse(res, 403, 'Unauthorized')
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
