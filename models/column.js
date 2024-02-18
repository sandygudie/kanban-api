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
  {
    collection: 'columns'
  }
)

// columnSchema.post('save', async function (column) {
//   try {
//     const board = await this.model('Board').findById({ _id: column.boardId })
//     board.columns.push(column._id)
//     await board.save()
//   } catch (error) {
//     console.log(error)
//   }
// })

module.exports = model('Column', columnSchema)
