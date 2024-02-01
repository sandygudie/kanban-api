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
      new Schema(
        {
          title: String,
          isCompleted: Boolean
        },
        { _id: false }
      )
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

taskSchema.post('save', async function (task) {
  try {
    const column = await this.model('Column').findOne({ _id: task.columnId })
    column.tasks.push(task._id)
    column.save()
  } catch (error) {
    console.log(error)
  }
})

module.exports = model('Task', taskSchema)
