const { Schema, model } = require('mongoose')

const taskSchema = Schema(
  {
    _id: {
      type: String
    },
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
    assignTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dueDate: [],
    dueTime: String,
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
