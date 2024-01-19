const { Schema, model } = require('mongoose')

const userSchema = Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profilepics: {
      type: String
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace'
    },
    isEmailVerified: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending',
      required: true
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: {
        expireAfterSeconds: 300,
        partialFilterExpression: { isEmailVerified: 'pending' }
      }
    },
    confirmationCode: {
      type: String
    },
    googleLogin: {
      type: String
    },
    githubLogin: {
      type: String
    }
  },
  { timestamps: true },
  {
    collection: 'user'
  }
)

// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     delete returnedObject.__v
//     delete returnedObject.password
//   }
// })

module.exports = model('User', userSchema)
