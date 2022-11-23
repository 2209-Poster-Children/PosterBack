const { client } = require(".")
const {getUserByUsername} = require('./users')

async function createAddress({
  address, zipcode, state, city, userId
}){
  console.log('lets make some address');
  

  try {
    const {rows: [addressl]} = await client.query(`
    INSERT INTO address(address, zipcode, state, city, "userId")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `, [address, zipcode, state, city, userId]);
    console.log(addressl, "(address) has been created");
    return addressl;
  } catch (error) {
    console.log(error);
  } 
}

module.exports={
  createAddress
}