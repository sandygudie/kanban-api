const User = require('../models/user')
const ResetCode = require('../models/resetCode')

const { errorResponse, successResponse } = require('../utils/responseHandler')
const { registerValidation, loginValidation } = require('../utils/validators')
const { emailVerification, passwordReset } = require('../utils/sendEmail/emailHandler')
const { generateToken } = require('../middlewares/token')
const { createAccount, createResetCode } = require('../services/auth')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client()

const register = async (req, res) => {
  try {
    const { email } = req.body
    const { error } = registerValidation(req.body)
    if (error) return errorResponse(res, 400, error.details[0].message)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      if (existingUser.isEmailVerified === 'pending') {
        return errorResponse(
          res,
          400,
          'Email already registered! check inbox for verification link'
        )
      } else {
        return errorResponse(res, 400, 'Email already exist')
      }
    } else {
      const { confirmationCode, newUser } = await createAccount(req.body)
      newUser.confirmationCode = confirmationCode
      await newUser.save()
      const emailInfo = {
        confirmationCode,
        name: newUser.name,
        email: newUser.email
      }
      const response = await emailVerification(emailInfo)
      if (response.message) {
        return errorResponse(res, 500, 'Error sending mail')
      } else {
        return successResponse(res, 200, 'Verification link sent to email!')
      }
    }
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

const verifyUserEmail = async (req, res) => {
  const existingUser = await User.findOne({
    confirmationCode: req.params.confirmationCode
  })
  if (existingUser) {
    existingUser.confirmationCode = null
    existingUser.isEmailVerified = 'verified'
    existingUser.expireAt = null
    await existingUser.save()
    const { accessToken } = await generateToken(existingUser)
    return res
      .cookie('access_token', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
        expires: new Date(Date.now() + 60 * 60 * 1000)
      })
      .status(200)
      .json({ message: 'Email Verification Sucessfully!', userId: existingUser._id })
  }
  return errorResponse(res, 404, 'Invalid or expired verification link!')
}

const login = async (req, res) => {
  const { email, password } = req.body
  const { error } = loginValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  const existingUser = await User.findOne({ email })
  if (existingUser && (await existingUser.comparePassword(password))) {
    const { accessToken } = await generateToken(existingUser)
    return res
      .cookie('access_token', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
        expires: new Date(Date.now() + 120 * 60 * 1000) // one hour
      })
      .status(200)
      .json({
        message: 'Logged in successfully',
        userdetails: { userId: existingUser._id, workspace: existingUser.workspace }
      })
  } else {
    return errorResponse(res, 403, 'Invalid username or password')
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    const { resetCode } = await createResetCode()
    const emailInfo = {
      resetCode,
      name: existingUser.name,
      email: existingUser.email
    }
    const response = await passwordReset(emailInfo)
    if (response.message) {
      return errorResponse(res, 500, 'Error sending mail')
    } else {
      return successResponse(res, 200, 'Reset link sent to email!')
    }
  } else {
    return errorResponse(res, 403, 'Email does not exist')
  }
}

const resetPassword = async (req, res) => {
  const { password, resetCode } = req.body
  const isExisting = await ResetCode.findOne({ resetCode })
  if (isExisting) {
    const existingUser = await User.findOne({ email: isExisting.email })
    existingUser.password = password
    existingUser.save()
    return errorResponse(res, 200, 'Password reset succesful')
  } else {
    return errorResponse(res, 403, 'Invalid Request')
  }
}

const logout = async (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out 😏 🍀' })
}

const googleLogin = async (req, res) => {
  const { credential, client_id: clientId } = req.body

  // client.setCredentials({ access_token: token })
  // const userinfo = await client.request({
  //   url: 'https://www.googleapis.com/oauth2/v3/userinfo'
  // })
  // const user = userinfo.data
  // console.log(user)
  // try {
  //   const existingUser = await User.findOne(user.email)
  //   if (existingUser) {

  //   }
  // } catch (error) {}
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId
    })
    const payload = ticket.getPayload()
    const userId = payload.sub
    console.log(userId)
    res.status(200).json({ payload })
  } catch (err) {
    res.status(400).json({ err })
  }
}

module.exports = {
  register,
  verifyUserEmail,
  login,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword
}
