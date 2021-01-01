const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const app = new express.Router()

//Tasks
app.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks').execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

app.get('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id)
    const task = await Task.findOne({ _id, user: req.user._id })

    if (!task) {
      return res.status(404).send('unable to find task')
    }
    res.send(task)
  } catch (e) {
    res.status(500).send('unable to find task')
  }
})

app.patch('/tasks/:id', auth, async (req, res) => {
  //validating update fields
  const allowedUpdates = ['complete', 'description']
  updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  if (!isValidOperation) return res.status(400).send({ error: 'invalid field update request' })

  //updating task 
  try {
    const _id = mongoose.Types.ObjectId(req.params.id)
    const task = await Task.findOne({ _id, user: req.user._id })

    if (!task) return res.status(404).send('task not found')

    updates.forEach(update => task[update] = req.body[update])
    await task.save()

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id)
    const task = await Task.findOne({ _id, user: req.user._id })
    if (!task) return res.status(404).send()
    task.remove()
    res.send(task)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

module.exports = app