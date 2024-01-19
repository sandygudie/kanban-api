const Joi = require('joi')

function registerValidation(data) {
  const schema = Joi.object({
    firstname: Joi.string().required().trim().label('First Name'),
    lastname: Joi.string().required().trim().label('Last Name'),
    email: Joi.string().email().required().lowercase().trim().label('email'),
    password: Joi.string().alphanum().min(5).required().trim().label('Password')
  })
  return schema.validate(data)
}
function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().label('email'),
    password: Joi.string().alphanum().min(5).required().trim().label('Password')
  })
  return schema.validate(data)
}

module.exports = {
  registerValidation,
  loginValidation
}
