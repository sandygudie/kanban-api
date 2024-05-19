const Joi = require('joi')

function registerValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required().trim().label('Name'),
    email: Joi.string().email().required().lowercase().trim().label('Email'),
    password: Joi.string().alphanum().min(5).required().trim().label('Password')
  })
  return schema.validate(data)
}
function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().label('Email'),
    password: Joi.string().required().trim().label('Password')
  })
  return schema.validate(data)
}

function resetValidation(data) {
  const schema = Joi.object({
    resetCode: Joi.string(),
    password: Joi.string().required().trim().label('Password')
  })
  return schema.validate(data)
}

function workspaceValidation(data) {
  const schema = Joi.object({
    workspaceName: Joi.string().required().trim().label('Workspace name'),
    profilePics: Joi.string().required()
  })
  return schema.validate(data)
}

function joinWorkspaceValidation(data) {
  const schema = Joi.object({
    workspaceName: Joi.string().required().trim().label('Workspace name'),
    inviteCode: Joi.string().trim().label('Workspace Invite code')
  })
  return schema.validate(data)
}
function workspaceInviteValidation(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().label('Email')
  })
  return schema.validate(data)
}

function boardValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required().trim().label('Board name'),
    column: Joi.array().items(Joi.string()).required().label('Column')
  })
  return schema.validate(data)
}
function columnValidation(data) {
  const schema = Joi.object({
    column: Joi.array().items(Joi.string()).required().label('Column')
  })
  return schema.validate(data)
}

function taskValidation(data) {
  const schema = Joi.object({
    title: Joi.string().required().trim().label('Task title'),
    subtasks: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().required(),
          isCompleted: Joi.boolean().required()
        })
      )
      .required()
      .label('Subtasks'),
    description: Joi.string().trim().allow('').optional(),
    position: Joi.number(),
    taskId: Joi.string()
  })
  return schema.validate(data)
}

module.exports = {
  registerValidation,
  resetValidation,
  loginValidation,
  workspaceValidation,
  workspaceInviteValidation,
  joinWorkspaceValidation,
  boardValidation,
  columnValidation,
  taskValidation
}
