const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    let data
    if (options.verification_url) {
      const verificationUrl = options.verification_url
      data = await ejs.renderFile(path.join(__dirname, '/templates/verifyemail.ejs'), {
        verificationUrl
        // pass data to the template file , firstname
      })
    } else {
      const resetUrl = options.reset_url
      data = await ejs.renderFile(path.join(__dirname, '/templates/resetlink.ejs'), {
        resetUrl
      })
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
  const verificationUrl = `${process.env.APP_HOSTNAME}/email-verify/?${user.confirmationCode}`
  const response = await sendEmail({
    email: user.email,
    subject: 'Verify your email address.',
    verificationUrl
  })
  return response
}

const passwordResetLink = async (user) => {
  const resetUrl = `https://quizbase.netlify.app/reset-password/?${user.confirmationCode}`
  const response = await sendEmail({
    email: user.email,
    subject: 'Reset Password',
    resetUrl
  })
  return response
}

module.exports = { sendEmail, emailVerification, passwordResetLink }
