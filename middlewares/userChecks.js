const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/responseHandler')
const { ACCESS_TOKEN_JWT_SECRET } = require('../config')

const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token || req.cookies.confirmation_code
  if (!token) {
    return errorResponse(res, 401, 'Unauthorized')
  }
  try {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_JWT_SECRET)
    req.user = decodedToken
    return next()
  } catch {
    return errorResponse(res, 401, 'Unauthorized')
  }
}

module.exports = { verifyUser }
