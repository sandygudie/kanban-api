const { Schema, model } = require('mongoose')

const workspaceSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    workspaceAdmin: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    inviteCode: {
      type: String
    },
    members: [
      new Schema(
        {
          userId: String,
          name: String,
          email: String,
          role: {
            type: String,
            enum: ['member', 'admin'],
            default: 'member'
          }
        },
        { _id: false }
      )
    ],
    pendingMembers: [String],
    profilePics: String,
    createdBy: String,
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }]
  },
  { timestamps: true },
  {
    collection: 'workspaces'
  }
)

module.exports = model('Workspace', workspaceSchema)
