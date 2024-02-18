const User = require('../models/user')
const { v4: uuidv4 } = require('uuid')

const createAccount = async (body) => {
  const newUser = await User.create(body)
  const confirmationCode = uuidv4()
  return { confirmationCode, newUser }
}

module.exports = {
  createAccount
}
