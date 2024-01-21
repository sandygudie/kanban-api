const bcrypt = require('bcrypt')
const { generateToken } = require('../middlewares/token')

const createAccount = async (user, body) => {
  const { password, email, firstname, lastname } = body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = await user.create({
    firstname,
    lastname,
    email,
    password: passwordHash
  })
  const { accessToken } = await generateToken(newUser)
  return { accessToken, newUser }
}

module.exports = {
  createAccount
}
