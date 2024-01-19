const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const { EMAIL_USER, EMAIL_PASS, APP_HOSTNAME } = require('../../config')

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })

    let data
    if (options.verificationUrl) {
      const { verificationUrl, username } = options
      data = await ejs.renderFile(path.join(__dirname, '/templates/verifyemail.ejs'), {
        verificationUrl,
        username
      })
    } else {
      const resetUrl = options.resetUrl
      data = await ejs.renderFile(path.join(__dirname, '/templates/resetlink.ejs'), {
        resetUrl
      })
    }
    const mailOptions = {
      from: EMAIL_USER,
      to: options.email,
      subject: options.subject,
      html: data
    }
    const response = await transporter.sendMail(mailOptions)
    if (response.response) {
      return response.response
    }
  } catch (error) {
    return error
  }
}

const emailVerification = async (user) => {
  const verificationUrl = `${APP_HOSTNAME}/api/v1/auth/email-verify/${user.confirmationCode}`
  const response = await sendEmail({
    email: user.email,
    subject: 'Verify your email address.',
    verificationUrl,
    username: user.firstname
  })
  return response
}

const passwordResetLink = async (user) => {
  const resetUrl = `https://quizbase.netlify.app/reset-password/?${user.confirmationCode}`
  const response = await sendEmail({
    email: user.email,
    subject: 'Reset Password',
    resetUrl,
    username: user.firstname
  })
  return response
}

module.exports = { sendEmail, emailVerification, passwordResetLink }
