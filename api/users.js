const express=require('express')
const {getAllUsers, createUser, getUser, getUserByUsername}=require ('../db/users')
const {getActiveCartByUserId} = require('../db/cart');
const { getAllAddressByUserId } = require('../db/address');
const { getAllReviewsById } = require('../db/reviews');
const {requireUser} = require('./utils');
const usersRouter=express.Router()
const jwt = require('jsonwebtoken');
const { getAllCartsUserId } = require('../db/cartDetails');
const {JWT_SECRET} =process.env;

// delete this b4 exporting the client 
// GET /api/users/
usersRouter.get('/',async(req,res,next)=>{
    try{
      const users = await getAllUsers();
      res.send(users)
    } catch ( { name, message } ) {
      next({ name, message })
    }
  });

// POST /api/users/login
usersRouter.post('/login',async (req,res,next)=>{
  const { username,password } =req.body;

  if(!username || !password){
    next({name:"Missing credentials", message:"No username or password entered."})
  }
  try{
    const user = await getUser(username,password);
    // console.log("this is my user obj", user);
    if (user) {
      const token = jwt.sign({ username: username, id: user.id}, JWT_SECRET,{expiresIn:"1w"})
      req.user = user;
      res.send({message: "Congratulations! You're logged in!", token});
    } else {
      if (!user) {
        next({
          name:'IncorrectCredentialsError',
          message:'Username or password is incorrect'
        });
      }

    }
  } catch ( { name, message } ) {
    next({ name, message })
  }
})


// never pass admin create separate function for promoting users (never pass req.body entirely)
// POST /api/users/register
usersRouter.post('/register', async (req,res,next)=>{
  //the request body values 
  const {username, password} =req.body;
  try{
    if(!username || !password) {
      next({ 
        name: 'MissingCredentials', 
        message: 'Missing username or password'
      });
    }
    //create new user, new token to immediately login if we wish upon register
      if(password.length <8 ){ 
        next({ 
          name: 'PasswordTooShortError', 
          message: 'Password is too short, must be at least 8 characters'
        });
      }
      else if(username.length <3 ){
        next({ 
          name: 'UsernameTooShort', 
          message: 'Username is too short, must be at least 3 characters'
        });
      } else {
      const _user = await getUserByUsername(username);

      

      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
      
      const user = await createUser({ username,password})
      const token = jwt.sign(
      {id: user.id, username}, process.env.JWT_SECRET, {expiresIn: '1w'})

      res.send({
        message:"thank you for signing up!",
        token,
        user
      })
    }
  } catch ( { name, message } ) {
    next({ name, message })
  }
});

// GET /api/users/me
usersRouter.get('/me',requireUser, async(req, res, next) => {
  try {
      // console.log(req.user)
      const user = await getUserByUsername(req.user.username);
      const addresses = await getAllAddressByUserId(user.id);
      const activeCart = await getActiveCartByUserId(user.id);
      const allCarts = await getAllCartsUserId(user.id);
      const reviews = await getAllReviewsById(user.id);
      res.send({ user, addresses, activeCart, allCarts, reviews });

    } catch ( { name, message } ) {
      next({ name, message })
  }
});


module.exports = usersRouter;