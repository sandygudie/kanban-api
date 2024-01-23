const Router = require('express')
const { register, verifyUserEmail, login, logout } = require('../controllers/auth')
const { verifyUser } = require('../middlewares/userChecks')

const authRouter = Router()
authRouter.post('/register', register)
authRouter.get('/email-verify/:confirmationCode', verifyUserEmail)
authRouter.post('/login', login)
authRouter.get('/logout', verifyUser, logout)

module.exports = { authRouter }
