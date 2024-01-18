const User = require('../models/user')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { registerValidation } = require('../utils/validators')
const { emailVerification } = require('../utils/sendEmail/emailHandler')
const bcrypt = require('bcrypt')
const { generateToken } = require('../middlewares/token')

const emailVerificationToken = async (user) => {
  const { accessToken } = await generateToken(user)
  user.confirmationCode = accessToken
  const newUser = await user.save()
  return newUser
}

const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body

  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }

  const { error } = registerValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  const existingUser = await User.findOne({ email })
  if (existingUser.isEmailVerified === 'verified') {
    return errorResponse(res, 400, 'Please continue to account set up')
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      firstname,
      lastname,
      email,
      password: passwordHash
    })

    const savedUser = await emailVerificationToken(user)
    const response = await emailVerification(savedUser)
    if (response) {
      return successResponse(res, 201, 'Verification mail sent to email')
    }
  }
}

const verifyUser = async (req, res) => {
  const user = await User.findOne({
    confirmationCode: req.params.confirmationCode
  })
  if (user) {
    user.isEmailVerified = 'verified'
    user.confirmationCode = null
    await user.save()
    return successResponse(res, 200, 'Email Verification Sucessfully!')
  }
  return errorResponse(res, 404, 'Invalid link')
}

module.exports = {
  register,
  verifyUser
}
