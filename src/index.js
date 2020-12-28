const express = require('express')

require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//initializing app
const app = express()
const port = process.env.port || 3000

//configuring app
app.use(express.json())

//routers
app.use(userRouter)
app.use(taskRouter)

//Start server
app.listen(port, () => {
  console.log('hello from server on ', port)
})