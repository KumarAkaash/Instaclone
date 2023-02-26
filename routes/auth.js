const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")

const requirelogin=require("../middleware/requirelogin")


router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the field" })
    }
    User.findOne({ email: email })
        .then((savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "User already existed with this email" })

            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Saved data Sucessfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        }))
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if (!email || !password ) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then((savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "inValid email or password" })
}
bcrypt.compare(password,savedUser.password)
.then(doMatch=>{
    if(doMatch){
        // res.json({message:"Sign in sucessfully"})
        const token=jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
        const{_id,name,email}=savedUser
        res.json({token,user:{_id,name,email}})
    }
    else{
        return res.status(422).json({ error: "inValid email or password" })
    }
})
.catch(err=>{
    console.log(err)
})
}))
})
module.exports = router