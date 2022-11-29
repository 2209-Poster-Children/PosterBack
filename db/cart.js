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

//this baby changes the total price of the cartId every time
//a value in cart details changes.
async function totalPricer(cartId){
  try{
    const {rows} = await client.query(`
    SELECT subtotal FROM "cartDetails"
    WHERE "cartId" = $1;`
    ,[cartId])
    console.log(rows)
    let total= 0;
    rows.map((subtotalKey,idx)=>{
      total+= +parseFloat(subtotalKey.subtotal).toFixed(2);
    })
    finalTotal = +total.toFixed(2)
    const {rows: [newCart]} = await client.query(`
    UPDATE cart SET "totalPrice" =$1
    WHERE id =$2
    RETURNING *
    `,[finalTotal,cartId])

    console.log(newCart);
    return newCart;
    
  } catch(error){
    console.log(error);
  }
}

async function obliterateAllCartDetails(cartId){
  try{
    
    const obliterate = await client.query(`
    DELETE FROM "cartDetails" 
    WHERE "cartId" =$1 RETURNING *;
    `, [cartId])
    console.log("obliterate" ,obliterate)
    return obliterate;
  } catch(error){
    console.log(error)
  }
}

async function deleteCart(id){
    try {
      const obliterate = await obliterateAllCartDetails(id);
      await client.query(`
        DELETE FROM cart
        WHERE id =$1
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
    getActiveCartByUserId,
    obliterateAllCartDetails,
    totalPricer
}