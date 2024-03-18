const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const { EMAIL_USER, EMAIL_PASS, APP_HOSTNAME } = require('../../config')
const { titleCase } = require('../index')
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
    } else if (options.resetUrl) {
      const { resetUrl, username } = options
      data = await ejs.renderFile(path.join(__dirname, '/templates/resetlink.ejs'), {
        username,
        resetUrl
      })
    } else {
      const { workspaceName, inviteCode, inviteLink, inviteNote } = options
      data = await ejs.renderFile(path.join(__dirname, '/templates/workspaceinvite.ejs'), {
        workspaceName,
        inviteCode,
        inviteLink,
        inviteNote
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

const emailVerification = async (emailInfo) => {
  const verificationUrl = `${APP_HOSTNAME}/email-verify/${emailInfo.confirmationCode}`
  const response = await sendEmail({
    email: emailInfo.email,
    subject: 'Verify your email address.',
    verificationUrl,
    username: titleCase(emailInfo.name)
  })
  return response
}

const passwordReset = async (emailInfo) => {
  const resetUrl = `${APP_HOSTNAME}/resetpassword/${emailInfo.resetCode}`
  const response = await sendEmail({
    email: emailInfo.email,
    subject: 'Reset Password',
    resetUrl,
    username: titleCase(emailInfo.name)
  })
  return response
}

const workspaceInvite = async (invite) => {
  const inviteLink = `${APP_HOSTNAME}/login`
  const response = await sendEmail({
    email: invite.email,
    subject: 'Workspace Invite',
    workspaceName: invite.workspaceName,
    inviteCode: invite.inviteCode,
    inviteNote: invite.inviteNote,
    inviteLink
  })
  return response
}

module.exports = { emailVerification, passwordReset, workspaceInvite }
