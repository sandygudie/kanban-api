const { Schema, model } = require('mongoose')

const projectSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }]
  },
  {
    collection: 'project-board'
  }
)

const Project = model('Project', projectSchema)

module.exports = Project
