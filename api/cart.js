const express = require('express');
const { getActiveCartByUserId } = require('../db/cart');
const cartRouter = express.Router();
const {requireUser} = require('./utils');
const {getCartDetailsByCart} = require('../db/cartDetails');

//get cart by userId
cartRouter.get('/',requireUser, async(req,res,next)=>{
    try{
        console.log(req.user.id);
        const {id} = await getActiveCartByUserId(req.user.id)
        const userCart = await getCartDetailsByCart(id)

        res.send(userCart)

    }catch(error){
        console.log(error);
    }

})

module.exports = cartRouter;