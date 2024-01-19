const { errorResponse } = require('../utils/responseHandler')

// Handling non-existing routes
const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'Route not found' })
  // return next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return errorResponse(response, 400, 'malformatted id')
  } else if (error.name === 'ValidationError') {
    return errorResponse(response, 400, error.message)
  } else if (error.name === 'JsonWebTokenError') {
    return errorResponse(response, 401, 'Invalid token')
  } else if (error.name === 'TokenExpiredError') {
    return errorResponse(response, 401, 'Token expired')
  } else if (error.name === 'TypeError') {
    return errorResponse(response, 400, 'Invalid Request')
  }
  console.error(error.message)
  return next(error)
}

// This overrides the default error handler to return a json response
const defaultErrorHandler = (error, req, res) => {
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message
  })
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  defaultErrorHandler
}
