const Router = require('express')
const {
  register,
  verifyUserEmail,
  login,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword
} = require('../controllers/auth')
const { verifyUser } = require('../middlewares/userChecks')

const authRouter = Router()

authRouter.post('/signup', register)
authRouter.get('/email-verify/:confirmationCode', verifyUserEmail)
authRouter.post('/login', login)
authRouter.get('/logout', verifyUser, logout)
authRouter.post('/google', googleLogin)
authRouter.post('/forgotpassword', forgotPassword)
authRouter.post('/resetpassword', resetPassword)

module.exports = { authRouter }
