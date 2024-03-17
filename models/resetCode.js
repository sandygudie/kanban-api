const { Schema, model } = require('mongoose')

const resetSchema = Schema(
  {
    resetCode: {
      type: String
    },
    email: { type: String },

    expireAt: {
      type: Date,
      default: Date.now,
      index: {
        expireAfterSeconds: 300
      }
    }
  },
  {
    timestamps: true
  },
  {
    collection: 'resetcode'
  }
)

module.exports = model('ResetCode', resetSchema)
