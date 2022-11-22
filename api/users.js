const express=require('express')
const {getAllUsers}=require ('../db/users')
const usersRouter=express.Router()


// delete this b4 exporting the client 
console.log(234)

usersRouter.get('/',async(req,res,next)=>{
    try{
      const users = await getAllUsers();
      res.send({users})
    } catch(error){
      console.log(error);
    }
  });

  module.exports =usersRouter;