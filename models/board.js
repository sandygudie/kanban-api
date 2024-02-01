const { Schema, model } = require('mongoose')

const boardSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
    workspaceId: {
      type: String,
      required: true
    }
  },
  {
    collection: 'board'
  }
)

module.exports = model('Board', boardSchema)
