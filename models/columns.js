const { Schema, model } = require('mongoose')

const columnSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    tasks: { type: Schema.Types.ObjectId, ref: 'Task' }
  },
  {
    collection: 'columns'
  }
)

const Column = model('Column', columnSchema)

module.exports = Column
