const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/Auth')
const router = new express.Router()

router.post('/tasks', auth, async (req , res)=>{
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks' , auth, async (req , res) => {

    try {
        // const tasks = await Task.find({owner:req.user._id})
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req , res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send("No such task exist")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async(req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })


    if (!isValidOperation) {
        return res.status(404).send("Please include valid keys")
    }

    try {
        const id = req.params.id
        const task = await Task.findById(id)

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        // const task = await Task.findByIdAndUpdate(id,  req.body , {new:true , runValidators: true} )
        if (!task) {
            return res.status(404).send('task not found')
        }
        res.send(task)
    } catch (e) {
        res.status(500)
    }
})

router.delete('/tasks/:id', async (req , res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send("Task not found")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send("Server down")
    }
})

module.exports = router