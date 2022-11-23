const { client } = require(".")

async function createAddress({
  address, zipcode, state, city, userId
}){
  console.log('lets make some address');
  try {
    const {rows: [product]} = await client.query(`
    INSERT INTO products(address, zipcode, state, city, "userID")
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (title) DO NOTHING
    RETURNING *;
    `, [address, zipcode, state, city, userId]);
    console.loge(address, "(address) has been created");
    return address;
  } catch (error) {
    console.log(error);
  } 
}

module.exports={
  createAddress
}