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
    type: String
  },

  members: [
    new Schema(
      {
        userId: String,
        role: String
      },
      { _id: false }
    )
  ],
  profilePics: String,
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
})

const Workspace = model('Workspace', workspaceSchema)

module.exports = Workspace
