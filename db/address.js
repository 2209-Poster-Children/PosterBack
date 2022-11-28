const { client } = require(".")
const {getUserByUsername} = require('./users')

async function getAllAddressByUserId(id) {
  try {
    if (!id) {
      console.log('no id sent')
      return null;
    }
    const { rows } = await client.query(`
      SELECT *
      FROM address
      WHERE id=$1;
      `, [id])
    
    console.log(rows)
    return rows;

  } catch (error) {
    console.log(error)
  }
}

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
// get address by user id active address 


module.exports={
  createAddress,
  getAllAddressByUserId
}