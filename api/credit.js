const express = require('express');
const { addCreditCard, getAllCreditCardsByUser, getActiveCreditCardByUser } = require('../db/creditcard');
const creditRouter = express.Router();
const {requireUser} = require('./utils');


creditRouter.get('/',requireUser, async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const getCredit = await getActiveCreditCardByUser(userId);

        res.send(getCredit);
    }catch(error){
        console.log(error);
    }
})


creditRouter.get('/cards',requireUser, async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const getCredit = await getAllCreditCardsByUser(userId);

        res.send(getCredit)
    }catch(error){
        console.log(error);
    }
})


creditRouter.post('/',requireUser,async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const {creditNumber, CVV, expiration, name, zipcode} = req.body;
        const newCreditCard = await addCreditCard({creditNumber, CVV, expiration, name, zipcode, userId})

        res.send(newCreditCard);

    }catch(error){
        console.log(error);
        next();
    }
})

module.exports = creditRouter;