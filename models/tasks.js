const { Schema, model } = require('mongoose')

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: String,
    assignTo: String,
    deadline: Date,
    subtasks: [{ title: String, isCompleted: Boolean }]
  },
  { timestamps: true },
  {
    collection: 'tasks'
  }
)

const Task = model('Task', taskSchema)

module.exports = Task
