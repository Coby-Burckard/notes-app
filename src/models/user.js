const mongoose = require('mongoose')
const crypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const Task = require('./task')

const userSchema = new mongoose.Schema({
  age: {
    type: Number,
    required: false,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    lowercase: true,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 7 || value.toLowerCase().includes('password')) {
        throw new Error('invalid password')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

//relationships
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'user'
})

//Custom static methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await crypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

//Custom instance methods
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'abc123')

  //adding token to user
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.tokens

  return userObject
}

//Middleware
//Hash plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await crypt.hash(user.password, 8)
  }

  next()
})

//Delete user task when user is removed
userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ user: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User