const express = require('express')
const addressRouter = express.Router();

const {createAddress, getAllAddressByUserId} = require('../db/address');
const {requireUser} = require('./utils');

addressRouter.get('/', requireUser, async (req, res, next) => {
  try {
    const {id} = req.user;
    const allAddresses = await getAllAddressByUserId(id);

    res.send({allAddresses});
  } catch (error) {
    console.log(error);
  }
})

addressRouter.post('/', requireUser, async (req, res, next) => {
  try {
    console.log('creating an address');
    console.log('is ', req.user.id, 'even what I think it is??????????????')
    const userId = req.user.id
    const {address, zipcode, state, city, primaryAddress} = req.body;
    const newAddress = await createAddress({address, zipcode, state, city, userId, primaryAddress})
    res.send({message: "new address created", address: newAddress})
  } catch (error) {
    console.log(error)
  }
})


module.exports = addressRouter;