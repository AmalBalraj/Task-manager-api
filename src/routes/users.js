const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/Auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendEmail, sendCancellationEmail } = require('../email/account')

const router = new express.Router()

// router.post('/users/getall', async (req , res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.send("Not working")
//     }
// })

router.post('/users',async (req, res)=>{
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        sendEmail(user.email, user.name)
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req , res) => {
    try {
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send("Unable to Login")
    }
})

router.post('/users/logout',auth , async (req, res) => {
    try {
        console.log(req.token)
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.send("Logged out user "+req.user.email)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth , async (req , res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Succesfully logged out of all devices")
    } catch (e) {
        res.send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload Image file'))
        }
        cb(undefined, true)
        // cb(new Error('File must be an Image'))
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req , res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, heigth:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req ,res, next) => {
    res.status(400).send(error.message)
})

router.get('/users/me', auth ,async (req , res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.send(e)
    }
})

router.get('/users/:id/avatar', async(req , res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
    
        res.set('Content-type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','age','password']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(404).send('Enter valid key')
    }
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send("Server down")
    }
})

router.delete('/users/me', auth, async (req , res) =>{
    try {
        sendCancellationEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send("user has been deleted")
    } catch (e) {
        res.status(500).send("Server down")
    }
})

router.delete('/users/me/avatar', auth, async(req , res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send("user avatar has been removed")
    } catch (e) {
        res.status(500).send("Error removing please try again later")
    }
})

module.exports = router