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

function workspaceValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required().trim().label('name'),
    description: Joi.string().trim().label('Workspace description')
  })
  return schema.validate(data)
}

function joinWorkspaceValidation(data) {
  const schema = Joi.object({
    workspaceName: Joi.string().required().trim().label('name'),
    workspaceInviteCode: Joi.string().trim().label('Workspace Invite code')
  })
  return schema.validate(data)
}
function ValidEmail(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().label('email')
  })
  return schema.validate(data)
}

function boardValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required().trim().label('name'),
    column: Joi.array().items(Joi.string()).required().label('column')
  })
  return schema.validate(data)
}
function columnValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required().trim().label('name')
  })
  return schema.validate(data)
}

function taskValidation(data) {
  const schema = Joi.object({
    title: Joi.string().required().trim().label('task title'),
    subtasks: Joi.object({
      title: Joi.string().required(),
      isCompleted: Joi.string().required()
    })
      .required()
      .label('subtasks'),
    description: Joi.string().trim().label('Task description'),
    assignTo: Joi.string().trim().label('assignTo'),
    deadline: Joi.string().trim().label('Task deadline')
  })
  return schema.validate(data)
}

module.exports = {
  registerValidation,
  loginValidation,
  workspaceValidation,
  ValidEmail,
  joinWorkspaceValidation,
  boardValidation,
  columnValidation,
  taskValidation
}
