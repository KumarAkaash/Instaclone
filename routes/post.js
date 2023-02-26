const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const requirelogin=require("../middleware/requirelogin")
const Post=mongoose.model("Post")

router.get('/allpost',requirelogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name") 
    .sort('-createdAt')
    .then(posts=>{
         res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body,pic}=req.body
    if(!body||!title||!pic){
        return res.status(422).json({err:"Please add all the fields"})
    }
    req.user.password=undefined;
    const post =new Post({
title,
body,
photo:pic,
postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
console.log(err)
    })
})

router.get('/mypost',requirelogin,(req,res)=>{
Post.find({postedBy:req.user._id})
.populate("postedBy","_id name")
.then(mypost=>{
    res.json({mypost})
})
.catch(err=>{
    console.log(err)
        })
})
module.exports=router