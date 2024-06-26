const User = require('../models/user')
const Workspace = require('../models/workspace')
const ResetCode = require('../models/resetCode')
const { v4: uuidv4 } = require('uuid')
const { errorResponse, successResponse } = require('../utils/responseHandler')
const { registerValidation, loginValidation, resetValidation } = require('../utils/validators')
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
      const { newUser } = await createAccount(req.body)
      const confirmationCode = uuidv4()
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
    return successResponse(res, 200, 'Email Verification Sucessfully!')
  }
  return errorResponse(res, 404, 'Invalid or expired verification link!')
}

const login = async (req, res) => {
  const { email, password } = req.body
  const { error } = loginValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)

  const existingUser = await User.findOne({ email })
  try {
    if (existingUser && (await existingUser.comparePassword(password))) {
      const { accessToken } = await generateToken(existingUser)
      const userdetails = {
        userId: existingUser._id,
        workspace: existingUser.workspace,
        access_token: accessToken
      }
      if (req.useragent.isMobile) {
        return successResponse(res, 200, 'Logged in successfully', { userdetails })
      } else {
        return res
          .cookie('access_token', accessToken, {
            httpOnly: false,
            sameSite: 'none',
            secure: 'auto',
            expires: new Date(Date.now() + 30 * 24 * 3600000)
          })
          .status(200)
          .json({
            message: 'Logged in successfully',
            data: { userdetails }
          })
      }
    } else {
      return errorResponse(res, 403, 'Invalid username or password')
    }
  } catch (err) {
    return errorResponse(res, 403, 'Invalid credentials')
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    const { resetCode } = await createResetCode(email)
    const emailInfo = {
      resetCode,
      name: existingUser.name,
      email: existingUser.email
    }
    const response = await passwordReset(emailInfo)
    if (response.message) {
      return errorResponse(res, 500, 'Error sending mail')
    } else {
      return successResponse(res, 200, 'Successful! Reset link sent to email!')
    }
  } else {
    return errorResponse(res, 403, 'Email does not exist')
  }
}

const resetPassword = async (req, res) => {
  const { password, resetCode } = req.body
  const { error } = resetValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  const isExistingCode = await ResetCode.findOne({ resetCode })
  if (isExistingCode) {
    const existingUser = await User.findOne({ email: isExistingCode.email })
    existingUser.password = password
    await existingUser.save()
    isExistingCode.resetCode = null
    await isExistingCode.save()
    return successResponse(res, 200, 'Password reset successful')
  } else {
    return errorResponse(res, 403, 'Expired Link')
  }
}

const logout = async (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out 😏 🍀' })
}

const googleLogin = async (req, res) => {
  const { token } = req.body
  client.setCredentials({ access_token: token })
  const userinfo = await client.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo'
  })
  const user = userinfo.data

  try {
    const existingUser = await User.findOne({ email: user.email })

    let token
    let currentUser
    if (!existingUser) {
      const { newUser } = await createAccount({
        name: user.name,
        email: user.email,
        profilePics: user.picture
      })
      newUser.isEmailVerified = 'verified'
      newUser.googleLogin = true
      currentUser = await newUser.save()
      const { accessToken } = await generateToken(currentUser)
      token = accessToken
    }

    if (existingUser !== null) {
      if (!existingUser.profilePics) {
        existingUser.profilePics = user.picture
        await existingUser.save()

        existingUser.workspace.map(async (ele) => {
          const workspace = await Workspace.findOne({ _id: ele._id }).populate({
            path: 'members'
          })

          const workspaceUser = await workspace.members.find(
            (item) => item.userId === existingUser._id.toString()
          )

          workspaceUser.profilePics = existingUser.profilePics
          await workspace.save()
        })
      }
      const { accessToken } = await generateToken(existingUser)
      token = accessToken
    }

    const userdetails = {
      userId: currentUser !== undefined ? currentUser._id : existingUser._id,
      workspace: currentUser !== undefined ? currentUser.workspace : existingUser.workspace,
      access_token: token
    }

    if (req.useragent.isMobile === true) {
      return successResponse(res, 200, 'Logged in succeully', { userdetails })
    } else {
      return res
        .cookie('access_token', token, {
          httpOnly: false,
          sameSite: 'none',
          secure: 'auto',
          expires: new Date(Date.now() + 30 * 24 * 3600000)
        })
        .status(200)
        .json({
          message: 'Logged in successfully',
          data: { userdetails }
        })
    }
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
