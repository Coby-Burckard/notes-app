const mongoose = require('mongoose')
const validator = require('validator')
const crypt = require('bcryptjs')

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
  }
})

//Custom functions
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

//Hash plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await crypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User