const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routes/tasks')
const userRouter = require('./routes/users')

const app = express()
const port = process.env.PORT

// app.use((req , res, next) => {
//     res.status(503).send("Website down for maintanence")
// })



app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, ()=>{
    console.log("server is running on port " + port)
})

