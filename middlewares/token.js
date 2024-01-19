const jwt = require('jsonwebtoken')

const {
  REFRESH_TOKEN_JWT_SECRET,
  ACCESS_TOKEN_JWT_REFRESH_EXPIRATION,
  ACCESS_TOKEN_JWT_EXPIRATION,
  ACCESS_TOKEN_JWT_SECRET
} = require('../config')

const generateToken = async (user) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_JWT_EXPIRATION
  })

  const refreshToken = jwt.sign({ id: user.id, email: user.role }, REFRESH_TOKEN_JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_JWT_REFRESH_EXPIRATION
  })
  return { accessToken, refreshToken }
}

// const verifyToken = async (req, res, next) => {
//   const bearerToken = req.headers.authorization
//   if (!bearerToken || !(bearerToken.search('Bearer ') === 0)) {
//     return errorResponse(res, 401, 'Unauthorized')
//   }
//   const token = bearerToken.split(' ')[1]
//   if (!token) return errorResponse(res, 401, 'Unauthorized')
//   const decoded = jwt.verify(token, ACCESS_TOKEN_JWT_SECRET)
//   if (!decoded) return errorResponse(res, 401, 'Unauthorized')
//   req.user = decoded
//   return next()
// }

module.exports = { generateToken }
