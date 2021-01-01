const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const auth = require('../middleware/auth')

const app = new express.Router()

//Users
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})

app.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

app.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

app.patch('/users/me', auth, async (req, res) => {
  //only certain fields can be updated
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(key => allowedUpdates.includes(key))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid updates!' })
  }

  //updating user
  try {
    updates.forEach(update => req.user[update] = req.body[update])

    await req.user.save()

    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.delete('/users/me', auth, async (req, res) => {

  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = app