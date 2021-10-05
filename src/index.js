const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routes/tasks')
const userRouter = require('./routes/users')

const app = express()
const port = process.env.PORT || 3000

// app.use((req , res, next) => {
//     res.status(503).send("Website down for maintanence")
// })

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, ()=>{
    console.log("server is running on port " + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('615c17f74b176b706dff0b23')
//     // await task.populate('owner')
//     // console.log(task.owner)
//     const user = await User.findById('615c175c0939017e1953e693')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }

// main()