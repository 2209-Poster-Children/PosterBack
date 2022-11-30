const express = require('express')
const addressRouter = express.Router();

const {createAddress, getAllAddressByUserId} = require('../db/address');
const {requireUser} = require('./utils');

// GET /api/address
addressRouter.get('/', requireUser, async (req, res, next) => {
  try {
    const {id} = req.user;
    const allAddresses = await getAllAddressByUserId(id);

    res.send({allAddresses});
  } catch ( { name, message } ) {
    next({ name, message })
}
})

// POST /api/address
addressRouter.post('/', requireUser, async (req, res, next) => {
  try {
    // console.log('creating an address');
    const userId = req.user.id
    const {address, zipcode, state, city, primaryAddress} = req.body;
    const newAddress = await createAddress({address, zipcode, state, city, userId, primaryAddress})
    res.send({message: "new address created", address: newAddress})
  } catch ( { name, message } ) {
    next({ name, message })
}
})


module.exports = addressRouter;