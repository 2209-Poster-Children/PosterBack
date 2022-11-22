const express=require('express')
const {getAllUsers, createUser, getUser}=require ('../db/users')
const usersRouter=express.Router()
const jwt = require('jsonwebtoken');
const {JWT_SECRET} =process.env;

// delete this b4 exporting the client 
usersRouter.get('/',async(req,res,next)=>{
    try{
      const users = await getAllUsers();
      res.send({users})
    } catch(error){
      console.log(error);
    }
  });

usersRouter.post('/login',async (req,res,next)=>{
  const { username,password } =req.body;

  if(!username || !password){
    next({name:"Missing credentials", message:"No username or password entered."})
  }
  try{
    const user = await getUser(username,password);
    console.log("this is my user obj", user);
    if(user && user.password == password){
      const token = jwt.sign({ username: username, id: user.id}, JWT_SECRET,{expiresIn:"1w"})
      req.user = user;
      res.send({message: "Congratulations! You're logged in!", token});
    } else {
      next("Incorrect login credentials, please try again")
    }
  } catch(error){
    console.log(error)
  }
})



usersRouter.post('/register', async (req,res,next)=>{
  //the request body values 
  const {username, password} =req.body;
  try{
  if(!username || !password) return "no username or password values entered"
  //create new user, new token to immediately login if we wish upon register
    const user = await createUser({ username,password})
    const token = jwt.sign(
    {id: user.id, username}, process.env.JWT_SECRET, {expiresIn: '1w'})

    res.send({
      message:"thank you for signing up!",
      token
    })

  }catch(error){
    console.log(error);
  }
})

module.exports = usersRouter;