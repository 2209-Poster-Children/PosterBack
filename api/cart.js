const express = require('express');
const { getActiveCartByUserId } = require('../db/cart');
const cartRouter = express.Router();
const {requireUser} = require('./utils');
const {getCartDetailsByCart, addItemToCartDetails} = require('../db/cartDetails');

//get cart by userId
cartRouter.get('/',requireUser, async(req,res,next)=>{
    try{
        const {id} = await getActiveCartByUserId(req.user.id)
        const userCart = await getCartDetailsByCart(id)
        //ya'll are not ready for this sick obj I'm about to give you.
        res.send(userCart)

    }catch(error){
        console.log(error);
    }
})

cartRouter.post('/',requireUser, async(req,res,next)=>{
    try{
        const {cartId, productId, quantity}= req.body
        const cartAdd = await addItemToCartDetails({})
    }catch(error){
        next({name:"Failed to add to cart",message:"Your item was not added to the cart."})
    }
})

cartRouter.

module.exports = cartRouter;