const { application } = require('express');
const express=require('express');
const apiRouter=express.Router()
require ('dotenv').config();
 

apiRouter.use('/',async(req,res,next)=>{
    console.log(32)
    next()
})
const usersRouter=require('./users')

apiRouter.use('/users',usersRouter)













module.exports=apiRouter;