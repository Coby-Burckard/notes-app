const express = require('express')
const mongoose = require('mongoose')
const Task = require('../models/task')

const app = new express.Router()

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
  try {
    const user = await Task.findById(req.params.id)
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
  updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  if (!isValidOperation) return res.status(400).send({ error: 'invalid field update request' })

  //updating task 
  try {
    const task = await Task.findById(req.params.id)
    updates.forEach(update => task[update] = req.body[update])
    await task.save()

    if (!task) return res.status(404).send('bad')
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

module.exports = app