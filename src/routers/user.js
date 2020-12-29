const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')

const app = new express.Router()

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

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    res.send(user)
  } catch (e) {
    res.status(400).send()
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
    const user = await User.findById(req.params.id)
    updates.forEach(update => user[update] = req.body[update])

    await user.save()

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.delete('/users/:id', async (req, res) => {

  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) return res.status(404).send()

    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = app