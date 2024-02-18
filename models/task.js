const { Schema, model } = require('mongoose')

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    status: String,
    assignTo: String,
    deadline: Date,
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
