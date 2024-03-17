const User = require('../models/user')
const ResetCode = require('../models/resetCode')
const { v4: uuidv4 } = require('uuid')

const createAccount = async (body) => {
  const newUser = await User.create(body)
  const confirmationCode = uuidv4()
  return { confirmationCode, newUser }
}

const createResetCode = async () => {
  const tempCode = uuidv4()
  const resetCode = await ResetCode.create({ resetCode: tempCode })

  return { resetCode }
}

module.exports = {
  createAccount,
  createResetCode
}
