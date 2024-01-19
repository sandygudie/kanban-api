const successResponse = (res, statusCode, status, data) => {
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

module.exports = { successResponse, errorResponse }
