const { Schema, model } = require('mongoose')

const workspaceSchema = Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'admin',
    required: true
  },
  members: [{ name: String, email: String }],
  profilePics: String,
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
})

const Workspace = model('Workspace', workspaceSchema)

module.exports = Workspace
