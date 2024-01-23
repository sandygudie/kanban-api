const { generateToken } = require('../middlewares/token')
const User = require('../models/user')

const createAccount = async (body) => {
  const newUser = await User.create(body)
  const { accessToken } = await generateToken(newUser)
  return { accessToken, newUser }
}

module.exports = {
  createAccount
}
