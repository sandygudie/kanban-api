const Router = require('express')
const { register, verifyUser } = require('../controllers/auth')

const authRouter = Router()
authRouter.post('/register', register)
authRouter.get('/verifyemail/:confirmationCode', verifyUser)

module.exports = { authRouter }
