const bcrypt = require('bcrypt')
const User = require('../models/user')
const { errorResponse } = require('../utils/responseHandler')
const { registerValidation, loginValidation } = require('../utils/validators')
const { emailVerification } = require('../utils/sendEmail/emailHandler')
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
  if (existingUser) {
    if (existingUser.isEmailVerified === 'verified') {
      return errorResponse(res, 400, 'Email already exist')
    } else {
      return errorResponse(res, 400, 'Check inbox for email verification')
    }
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
      return res
        .cookie('confirmation_code', savedUser.confirmationCode, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax', // or 'Strict', it depends
          expires: new Date(Date.now() + 5 * 60 * 1000)
        })
        .status(201)
        .json({ message: 'Verification mail sent to email!' })
    }
  }
}
const verifyUserEmail = async (req, res) => {
  const user = await User.findOne({
    confirmationCode: req.params.confirmationCode
  })
  if (user) {
    user.isEmailVerified = 'verified'
    user.confirmationCode = null
    user.expireAt = null
    await user.save()
    const { accessToken } = await generateToken(user)
    return res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax', // or 'Strict', it depends
        expires: new Date(Date.now() + 60 * 60 * 1000)
      })
      .status(200)
      .json({ message: 'Email Verification Sucessfully!' })
  }
  return errorResponse(res, 404, 'Invalid link')
}

const login = async (req, res) => {
  if (!req.body) {
    return errorResponse(res, 400, 'no request body')
  }
  const { email, password } = req.body
  const { error } = loginValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    const { accessToken } = await generateToken(user)
    return res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: new Date(Date.now() + 60 * 60 * 1000) // one hour
      })
      .status(200)
      .json({ message: 'Logged in successfully' })
  } else {
    return errorResponse(res, 400, 'Invalid credentials')
  }
}

const logout = async (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out 😏 🍀' })
}

module.exports = {
  register,
  verifyUserEmail,
  login,
  logout
}
