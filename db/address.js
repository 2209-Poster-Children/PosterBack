const { client } = require(".")

//if no id then complain else return (all) addresses.
async function getAllAddressByUserId(id) {
  try {
    if (!id) {
      console.log('no id sent')
      return null;
    }
    const { rows } = await client.query(`
        SELECT * FROM address
        WHERE "userId"=$1;
      `, [id])
    
    return rows;
  } catch (error) {
    console.log(error)
  }
}

// one must assume the most recently created address is the active one.
async function createAddress({ address, zipcode, state, city, userId }) {
  try {
    const {rows: [newAddress]} = await client.query(`
      INSERT INTO address(address, zipcode, state, city, "userId")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [address, zipcode, state, city, userId]);

    return newAddress;
  } catch (error) {
    console.log(error);
  } 
}
// get address by user id active address 


async function updateAddress(addressId, fields) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(',');

  if (setString.length === 0) return;

  try {
    const { rows: [address] } =await client.query(`
      UPDATE address 
      SET ${setString}
      WHERE id=${addressId}
      RETURNING *; 
    `, Object.values(fields));

    return address;
  } catch (error){
    throw error;
  }
}

async function deleteAddress(addressId) {
  try {
    const { rows: [address]} = await client.query(`
      DELETE FROM address 
      WHERE id=$1 
      RETURNING *;
    `, [addressId]);

    return address;
  } catch (error) {
    console.log(error);
  }
}

module.exports={
  createAddress,
  getAllAddressByUserId,
  updateAddress,
  deleteAddress
}