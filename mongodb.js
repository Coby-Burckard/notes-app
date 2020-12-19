const { MongoClient, ObjectID } = require('mongodb')


//initialize database
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('unable to connect to db')
  }

  const db = client.db(databaseName)
  const tasksCollection = db.collection('tasks')
  const usersCollection = db.collection('users')

  usersCollection.findOne({ name: 'coby' }, (error, user) => {
    if (error) return console.log('unable to find user')

    console.log(user)
  })
})