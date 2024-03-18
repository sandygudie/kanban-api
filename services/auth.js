const User = require('../models/user')
const ResetCode = require('../models/resetCode')
const { v4: uuidv4 } = require('uuid')

const createAccount = async (body) => {
  const newUser = await User.create(body)
  return { newUser }
}

const createResetCode = async () => {
  const tempCode = uuidv4()
  const newResetCode = await ResetCode.create({ resetCode: tempCode })
  const resetCode = newResetCode.resetCode
  return { resetCode }
}

module.exports = {
  createAccount,
  createResetCode
}
