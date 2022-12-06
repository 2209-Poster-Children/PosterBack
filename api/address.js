const express = require('express')
const addressRouter = express.Router();

const {createAddress, getAllAddressByUserId, updateAddress, deleteAddress} = require('../db/address');
const {requireUser} = require('./utils');

// GET /api/address
addressRouter.get('/', requireUser, async (req, res, next) => {
  try {
    const {id} = req.user;
    const allAddresses = await getAllAddressByUserId(id);
    if (allAddresses) {
      res.send({allAddresses});
    } else {
      next({
        name: 'GetAddressesError',
        message: 'Error getting addresses'
      });
    }

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
    if (newAddress) {
      res.send({message: "new address created", address: newAddress})
    } else {
      next({
        name: 'PostNewAddressError',
        message: 'Error adding new address'
      });
    }
  } catch ( { name, message } ) {
    next({ name, message })
}
})

// PATCH /api/address/:addressId
addressRouter.patch('/:addressId', requireUser, async (req, res, next) => {
  const { addressId } = req.params;
  const { address, city, state, zipcode, primaryAddress } = req.body;

  const updateFields = {};

  if (address) updateFields.address = address;
  if (city) updateFields.city = city;
  if (state) updateFields.state = state;
  if (zipcode) updateFields.zipcode = zipcode;
  if (primaryAddress) updateFields.primaryAddress = primaryAddress;

  try {
      const updatedAddress = await updateAddress(addressId, updateFields);
      if (updatedAddress) {
        res.send({ address: updatedAddress });
      } else {
        next({
          name: 'UpdateAddressError',
          message: 'Address not updated, wrong address id'
        });
      }

  } catch ({name,message}) {
      next({name,message});
  }
});

// DELETE /api/address/:addressId
addressRouter.delete('/:addressId', requireUser, async (req, res, next) => {
  const { addressId } = req.params;

  try{
    const deletedAddress = await deleteAddress(addressId);
    if (deletedAddress) {
      res.send({ address: deletedAddress, message: "Address has been deleted"});
    } else {
      next({
        name: 'DeleteAddressError',
        message: 'Nothing was deleted, wrong address id'
      });
    }

  }catch({name, message}){
      next({name, message})
  }
})


module.exports = addressRouter;