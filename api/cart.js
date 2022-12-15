const express = require('express');
const { getActiveCartByUserId, purchaseCart, getActiveCartId} = require('../db/cart');
const cartRouter = express.Router();
const {requireUser, makePurchase} = require('./utils');
const {getAllCartsUserId, addItemToCartDetails, addQuantityToCart,
       removeItemFromCartDetails } = require('../db/cartDetails');

// GET /api/cart
cartRouter.get('/',requireUser, async(req,res,next)=>{
    try{
        const cart = await getActiveCartByUserId(req.user.id)
        console.log(cart);
        //ya'll are not ready for this sick obj I'm about to give you.
        res.send(cart)

    }catch ({ name, message}){
        next({ name, message })
    }
})

// GET /api/cart/allcart
cartRouter.get('/allcart/',requireUser, async(req,res,next)=>{
    try{
        const id = req.user.id;
        const carts = await getAllCartsUserId(id);

        res.send(carts);
    }catch(error){
        next({name,message})
    }
})
// POST /api/cart
cartRouter.post('/',requireUser, async(req,res,next)=>{
    try{
        const {cartId} = await getActiveCartByUserId(req.user.id)
        console.log(cartId);
        const {productId, quantity}= req.body
        const cartAdd = await addItemToCartDetails({cartId,productId,quantity})

        res.send(cartAdd);
    }catch({name,message}){
        next({name:"Failed to add to cart",message:"Your item was not added to the cart."})
    }
})

//PATCH /api/cart    change quantity of item
cartRouter.patch('/',requireUser, async(req,res,next)=>{
    try{
        const {cartId} = await getActiveCartByUserId(req.user.id)
        console.log(cartId)
        const {productId,quantity} = req.body
        const cartQuantity = await addQuantityToCart(cartId,productId,quantity)

        res.send(cartQuantity)
    }catch({name,message}){
        next({name:"failed to change quantity",message:"quantity not changed....?"})
    }
})

//PATCH /api/cart/purchase (sets cart to false, assigns bought at value)
cartRouter.patch('/purchase',requireUser,async(req,res,next)=>{
    try{
        const {cartId,totalPrice}= await getActiveCartByUserId(req.user.id)
        req.totalPrice = totalPrice;
        const purchase = await purchaseCart(cartId,req.user.id);
        if(purchase) {
            console.log("Purchase made, enjoy your posters!")
            res.send( {name:"Purchase successful.",message:"Enjoy your posters! Thank you for shopping with Poster-Children!",purchase:purchase})
        }else{
            res.send({name:"Purchase Unsuccessful", message:"no posters for you"})
        }
    }catch(error){
        console.log(error)
        res.send({name:"Failure to purchase",message:"An error occurred while making your purchase, please contact us or try again."})
    }
})

cartRouter.post('/paymentIntent',requireUser,async(req,res,next)=>{
    try{
        const {totalPrice} = await getActiveCartByUserId(req.user.id)
    req.totalPrice = totalPrice;
    req.clientSecret = await makePurchase(req,res);
    if(!req.clientSecret) res.send({name:"no secret", message:"nothing was in your pocketses"})
    else res.send( {clientSecret: req.clientSecret, name: "got client secret (mulk)"})
    }catch(error){
        console.log(error);
        res.send(error);
    }
})

//DELETE /api/cart/:productId
cartRouter.delete('/:productId',requireUser,async(req,res,next)=>{
    try{
        const {id} = await getActiveCartId(req.user.id)
        console.log("api/cartid ", id)
        //function to check if the user's id matches the cart id
        const {productId} = req.params;
        const deleteItem = await removeItemFromCartDetails(productId,id);

        res.send(deleteItem)
    }catch({name, message}){
        next({name:"failed to delete item", message:"The item was already deleted from cart or failed to delete."})
    }
})

module.exports = cartRouter;