const { Schema, model } = require('mongoose')

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    piority: {
      type: String
    },
    createdBy: {
      type: String
    },
    description: String,
    status: String,
    tags: [],
    assignTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dueDate: [],
    dueTime: String,
    attachments: [
      new Schema({
        type: String,
        name: String,
        url: String,
        addDate: Date
      })
    ],
    subtasks: [
      new Schema({
        title: String,
        isCompleted: Boolean
      })
    ],
    columnId: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
  {
    collection: 'tasks'
  }
)

module.exports = model('Task', taskSchema)
