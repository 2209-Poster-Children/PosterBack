const express = require('express');
const { getActiveCartByUserId } = require('../db/cart');
const cartRouter = express.Router();
const {requireUser} = require('./utils');
const {getCartDetailsByCart, addItemToCartDetails, addQuantityToCart, removeItemFromCartDetails} = require('../db/cartDetails');

// I need to write prohibitive code that only allows users of carts to act upon their own carts.. 
// Thinking of a way to do that
// GET /api/cart
cartRouter.get('/',requireUser, async(req,res,next)=>{
    try{

        const {id} = await getActiveCartByUserId(req.user.id)
        const userCart = await getCartDetailsByCart(id)
        //ya'll are not ready for this sick obj I'm about to give you.
        res.send(userCart)

    }catch ({ name, message}){
        next({ name, message })
    }
})

// POST /api/cart
cartRouter.post('/',requireUser, async(req,res,next)=>{
    try{
        const {id} = await getActiveCartByUserId(req.user.id)
        const {productId, quantity}= req.body
        const cartAdd = await addItemToCartDetails({id,productId,quantity})

        res.send(cartAdd);
    }catch({name,message}){
        next({name:"Failed to add to cart",message:"Your item was not added to the cart."})
    }
})


//PATCH /api/cart    change quantity of item
cartRouter.patch('/',requireUser, async(req,res,next)=>{
    try{
        const {id} = await getActiveCartByUserId(req.user.id)
        const {productId,quantity} = req.body
        const cartQuantity = await addQuantityToCart(id,productId,quantity)

        res.send(cartQuantity)
    }catch({name,message}){
        next({name:"failed to change quantity",message:"quantity not changed....?"})
    }
})

//DELETE /api/cart/:productId
cartRouter.delete('/:productId',requireUser,async(req,res,next)=>{
    try{
        const {id} = await getActiveCartByUserId(req.user.id)
        //function to check if the user's id matches the cart id
        const {productId} = req.params;
        const deleteItem = await removeItemFromCartDetails(productId,id);

        res.send(deleteItem)
    }catch({name, message}){
        next({name:"failed to delete item", message:"The item was already deleted from cart or failed to delete."})
    }
})

module.exports = cartRouter;