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
  }
})

const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  complete: {
    type: Boolean
  }
})

// const me = new User({
//   name: 'Coby',
//   age: '25tsdf'
// })

const you = new User({ name: '  bob    ', email: '   mike@yahoo.com   ' })


const dishes = new Task({
  description: 'do the dishes',
  complete: false
})

const saveDocument = (document) => {
  document.save().then(result => console.log(result)).catch(error => console.log(error))
}

saveDocument(you)