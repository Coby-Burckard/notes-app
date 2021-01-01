const mongoose = require('mongoose')

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
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  }
})

module.exports = Task