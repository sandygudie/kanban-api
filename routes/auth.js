const Router = require('express')
const { register, verifyUserEmail, login, logout, googleLogin } = require('../controllers/auth')
const { verifyUser } = require('../middlewares/userChecks')

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/email-verify/:confirmationCode', verifyUserEmail)
authRouter.post('/login', login)
authRouter.get('/logout', verifyUser, logout)
authRouter.post('/google', googleLogin)

module.exports = { authRouter }
