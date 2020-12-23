const mongoose = require('mongoose')
const validator = require('validator')

const connectionURL = 'mongodb://127.0.0.1:/task-manager-api'

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true
})

const User = mongoose.model('User', {
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
    type: String,
    required: true,
    trim: true,
    lowercase: true,
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

const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    required: true
  },
  complete: {
    type: Boolean,
    required: false,
    default: false
  }
})

const me = new User({
  name: 'Violet',
  age: 25,
  password: 'normalPass',
  email: 'v@arasaka.com'
})

const you = new User({ name: '  bob    ', email: '   mike@yahoo.com   ' })


const groceries = new Task({})

const saveDocument = (document) => {
  document.save().then(result => console.log(result)).catch(error => console.log(error))
}

saveDocument(groceries)