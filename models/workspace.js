const { Schema, model } = require('mongoose')

const workspaceSchema = Schema({
  name: {
    type: String,
    required: true
  },
  workspaceAdmin: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'admin',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  members: [{ name: String, email: String }],
  // you email has to be added to the memeber list and you must have an account with us
  profilePics: String,
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
})

const Workspace = model('Workspace', workspaceSchema)

module.exports = Workspace
