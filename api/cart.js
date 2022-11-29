const express = require('express');
const { getActiveCartByUserId } = require('../db/cart');
const cartRouter = express.Router();
const {requireUser} = require('./utils');
const {getCartDetailsByCart, addItemToCartDetails, addQuantityToCart, removeItemFromCartDetails} = require('../db/cartDetails');

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
        const cartAdd = await addItemToCartDetails({cartId,productId,quantity})

        res.send(cartAdd);
    }catch(error){
        next({name:"Failed to add to cart",message:"Your item was not added to the cart."})
    }
})


//PATCH change quantity of item
cartRouter.patch('/',requireUser, async(req,res,next)=>{
    try{
        const {cartId,productId,quantity} = req.body
        const cartQuantity = await addQuantityToCart(cartId,productId,quantity)

        res.send(cartQuantity)
    }catch(error){
        next({name:"failed to change quantity",message:"quantity not changed....?"})
    }
})

//if user is not the same for both Patch, Post, and Delete
cartRouter.delete('/:productId',requireUser,async(req,res,next)=>{
    try{
            const {id} = req.user 
            
            //function to check if the user's id matches the cart id
        const {productId} = req.params;
        const {cartId} = req.body;
        const deleteItem = await removeItemFromCartDetails(productId,cartId);

        res.send(deleteItem)
    }catch(error){
        next({name:"failed to delete item", message:"The item was already deleted from cart or failed to delete."})
    }
})

module.exports = cartRouter;