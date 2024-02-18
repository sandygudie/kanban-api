const successResponse = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({
    message,
    data
  })
}
const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message
  })
}

const catchAsyncError = (fn) => async (req, res, next) => {
  const response = await fn(req, res, next).catch(next)
  return response
}

module.exports = { successResponse, errorResponse, catchAsyncError }
