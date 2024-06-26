const { Schema, model } = require('mongoose')

const columnSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    boardId: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
  {
    collection: 'columns'
  }
)

module.exports = model('Column', columnSchema)
