const express = require('express');
const { addCreditCard } = require('../db/creditcard');
const creditRouter = express.Router();
const {requireUser} = require('./utils');

creditRouter.get('/',requireUser, async(req,res,next)=>{
    
})
creditRouter.post('/',requireUser,async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const {creditNumber, CVV, expiration, name, zipcode} = req.body;
        const newCreditCard = await addCreditCard({creditNumber, CVV, expiration, name, zipcode, userId})

        res.send(newCreditCard);

    }catch({name,message}){
        next({name,message})
    }
})



module.exports = creditRouter;