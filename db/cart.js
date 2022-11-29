const { client } = require(".")

//create cart needs a token functionality that pays attention to guest users and stores their information it could be front-end
async function createCart({
    userId, isActive,totalPrice 
}){
    console.log("lets make a cart");
    try{
    const{rows: [cart]} = await client.query(`
        INSERT INTO cart("userId", "isActive", "totalPrice")
        VALUES ($1,$2,$3)
        RETURNING *;
        `,[userId, isActive, totalPrice]);
        console.log( cart, "has been created");
        return cart;
    } catch(error){
        console.log(error)
    }
}

async function getCartsByUserId(userId){
  console.log("getting carts by user id" , userId)
  try{
    const{rows} =await client.query(`
    SELECT * FROM cart
    WHERE "userId" =$1;`
    ,[userId]);
    console.log(rows)
    return rows
  }catch(error){
    console.log(error)
  }
}
async function getActiveCartByUserId(userId){
  console.log("getting Active cart by user id" , userId)
  try{
    const{rows: [cart]} =await client.query(`
    SELECT * FROM cart
    WHERE  "isActive" = true AND "userId" =$1;`
    ,[userId]);
    console.log(cart);
    return cart
  }catch(error){
    console.log(error)
  }
}

// this function isn't going to work. with cart details 
// being a dependant on deletecart
// we need to delete cart details related to the cart first
// we're never going to delete a cart, just pass it as false or remove all the items
// unless the user quits the site

// async function deleteCartDetails(){

// }
async function deleteCart(id){
    try {
      await client.query(`
        DELETE FROM carts
        WHERE id=$1
        RETURNING *;
        `, [id]);
  
        return id, "cart has been emptied";
    } catch (error) {
      console.log(error);
    }
}

module.exports={
    createCart,
    deleteCart,
    getCartsByUserId,
    getActiveCartByUserId
}