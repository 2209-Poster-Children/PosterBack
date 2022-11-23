const express=require('express');
const apiRouter=express.Router()
require ('dotenv').config();


apiRouter.use('/',async(req,res,next)=>{
    console.log(32)
    next()
})
const usersRouter=require('./users')
apiRouter.use('/users',usersRouter)
const productsRouter = require('./products')
apiRouter.use('/products',productsRouter)
const reviewsRouter = require('./reviews')
apiRouter.use('/reviews',reviewsRouter)
const addressRouter = require('./address')
apiRouter.use('/address',addressRouter );
// const cartRouter = require('./cart');
// apiRouter.use('/cart',cartRouter);

module.exports=apiRouter;