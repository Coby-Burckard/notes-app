const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.port || 3000

app.use(express.json())


//Users
app.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})


app.get('/users', async (req, res) => {
  try {
    const result = await User.find()
    res.send(result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send('unable to find user')
    }
    res.send(user)
  } catch (e) {
    res.status(500).send('unable to find user')
  }
})

app.patch('/users/:id', async (req, res) => {
  //only certain fields can be updated
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(key => allowedUpdates.includes(key))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid updates!' })
  }

  //updating user
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})


//Tasks
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/tasks', async (req, res) => {

  try {
    const result = await Task.find()
    res.send(result)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await Task.findById(_id)
    if (!user) {
      return res.status(404).send('unable to find task')
    }
    res.send(user)
  } catch (e) {
    res.status(500).send('unable to find task')
  }
})

app.patch('/tasks/:id', async (req, res) => {
  //validating update fields
  const allowedUpdates = ['complete', 'description']
  const isValidOperation = Object.keys(req.body).every(update => allowedUpdates.includes(update))
  if (!isValidOperation) return res.status(400).send({ error: 'invalid field update request' })

  //updating task 
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!task) return res.status(404).send('bad')
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

//Start server
app.listen(port, () => {
  console.log('hello from server on ', port)
})