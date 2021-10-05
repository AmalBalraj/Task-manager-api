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

// GET /tasks?completed=true
// GET /tasks?limit=3&skip=3
// GET /tasks?sortBy=createdAt:asc (asc = 1, desc =-1)


router.get('/tasks' , auth, async (req , res) => {
    const match = {}
    const sort = {}

    console.log(req.query.completed)
    if (req.query.completed){
        match.completed = (req.query.completed === 'true')
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1]==='asc'? 1: -1
        console.log(sort)
    }

    try {
        // const tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
                // sort:{
                //     createdAt: 1
                // }
            }
        })
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

router.patch('/tasks/:id', auth, async(req , res) => {
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
        const task = await Task.findOne({_id:id, owner:req.user._id})
        // const task = await Task.findById(id)
        
        if (!task) {
            return res.status(404).send('task not found')
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500)
    }
})

router.delete('/tasks/:id', auth, async (req , res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send("Task not found")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send("Server down")
    }
})

module.exports = router