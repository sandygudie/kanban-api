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
    assignTo: [
      new Schema(
        {
          userId: String,
          profilePics: String
        },
        { _id: false }
      )
    ],
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
