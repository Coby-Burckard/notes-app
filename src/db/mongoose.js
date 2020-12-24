const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:/task-manager-api'

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true
})