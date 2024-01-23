const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
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
    workspace: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
      }
    ],
    confirmationCode: {
      type: String
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
userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)
  user.password = hash
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = model('User', userSchema)
