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
  boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }]
})

// workspaceSchema.post('save', async function (child) {
//   try {
//     const parent = await this.model('board').findOne({ _id: child.parent })
//     parent.children.push(child._id)
//     parent.save()
//   } catch (error) {} 1012108290
// })

module.exports = model('Workspace', workspaceSchema)
