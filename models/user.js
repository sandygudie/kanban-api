const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String
      // required: true
    },
    profilePics: {
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
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret, options) => {
        // console.log(ret)
        delete ret.password
        delete ret.__v
        return ret
      }
    }
  },
  {
    collection: 'user'
  }
)

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
