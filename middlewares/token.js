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

module.exports = { generateToken }
