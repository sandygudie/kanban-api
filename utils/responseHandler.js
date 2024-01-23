const successResponse = (res, statusCode, status, data = {}) => {
  res.status(statusCode).json({
    success: status,
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
