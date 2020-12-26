const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.port || 3000

app.use(express.json())


//Create
app.post('/users', (req, res) => {
  const user = new User(req.body)

  user
    .save()
    .then(() => {
      res.status(201).send(user)
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task
    .save()
    .then(() => {
      res.status(201).send(task)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})


//Read
app.get('/users', (req, res) => {
  User.find()
    .then(result => res.send(result))
    .catch(e => res.status(500).send(e))
})

app.get('/users/:id', (req, res) => {
  const _id = req.params.id

  User.findById(_id)
    .then(user => {
      if (!user) {
        return res.status(404).send('unable to find user')
      }
      res.send(user)
    })
    .catch(e => {
      res.status(500).send('unable to find user')
    })
})


app.get('/tasks', (req, res) => {
  Task.find()
    .then(result => res.send(result))
    .catch(e => res.status(500).send(e))
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id

  Task.findById(_id)
    .then(user => {
      if (!user) {
        return res.status(404).send('unable to find task')
      }
      res.send(user)
    })
    .catch(e => {
      res.status(500).send('unable to find task')
    })
})

//Start server
app.listen(port, () => {
  console.log('hello from server on ', port)
})