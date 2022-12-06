const { client } = require(".")

//create cart needs a token functionality that pays attention to guest users and stores their information it could be front-end
async function createCart({
    userId, isActive,totalPrice 
}){
    // console.log("lets make a cart");// it's always going to be active unless in the seed
    try{
    const{rows: [cart]} = await client.query(`
        INSERT INTO cart("userId", "isActive", "totalPrice")
        VALUES ($1,$2,$3)
        RETURNING *;
        `,[userId, isActive, totalPrice]);
        // console.log( cart, "has been created");
        return cart;
    } catch(error){
        console.log(error)
    }
}

//all carts, open and closed(maybe I should just make a closed instead of a dual one)
// async function getCartsByUserId(userId){
//   // console.log("getting carts by user id" , userId)
//   try{
//     const{rows} =await client.query(`
//     SELECT * FROM cart
//     WHERE "userId" =$1;`
//     ,[userId]);
//     // console.log(rows)
//     return rows
//   }catch(error){
//     console.log(error)
//   }
// }

//users should only have 1 active cart, am going to write code that guaruntees that... currently this gets the carts active by user
async function getActiveCartByUserId(userId){
  // console.log("getting Active cart by user id" , userId)
  try{
    const {rows: [cart]} = await client.query(`
    SELECT cart.id AS "cartId", 
    cart."totalPrice",
    CASE WHEN "cartDetails"."cartId" IS NULL THEN '[]'::json
    ELSE
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'productId', products.id,
            'title', products.title,
            'price', products.price,
            'quantity', "cartDetails".quantity,
            'imageUrl', products."imageUrl",
            'imageAlt', products."imageAlt",
            'subtotal', "cartDetails".subtotal
        )
    ) END AS products
    FROM cart
    LEFT JOIN "cartDetails" 
        ON cart.id = "cartDetails"."cartId"
    LEFT JOIN "products"
        ON products.id = "cartDetails"."productId"
    WHERE cart."userId" = $1 AND cart."isActive" = true
    GROUP BY cart.id, "cartDetails"."cartId";
    `,[userId])
    console.log(cart);
    return cart;
    
  }catch(error){
      console.log(error)
  }
}

//this baby changes the total price of the cartId every time
//a value in cartDetails changes.
async function totalPricer(cartId){
  try{
    const {rows} = await client.query(`
      SELECT subtotal FROM "cartDetails"
      WHERE "cartId" = $1;`
      ,[cartId])

    let total= 0;
    //This attempts to force the total into a structure but PSQL hates us. so it's a string
    rows.map((subtotalKey,idx)=>{
      total+= +parseFloat(subtotalKey.subtotal);
    })
    finalTotal = +total.toFixed(2);
    const {rows: [newCart]} = await client.query(`
      UPDATE cart SET "totalPrice" =$1
      WHERE id =$2
      RETURNING *
      `,[finalTotal,cartId])

    return newCart;
    
  } catch(error){
    console.log(error);
  }
}

//this should delete all of the info inside a cart (but leave the cart in-tact)
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

//this actually deletes a cart. You never really want to do this
//(as an active cart can always be reset and used for a different shopping spree.)
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

//this one will be the big code.
async function purchaseCart(cartId,userId){
  try{
    //three calls function, needs cartId, userId
    //assign totalPrice per cart detail (current subtotal )
    const {rows} = await client.query(`
      UPDATE "cartDetails" SET "priceBoughtAt" = subtotal
      WHERE "cartId" = $1
      RETURNING*;
      `,[cartId])
      console.log("shows" , rows);
    // assign cart to false (rows to rows2 renames the destructured rows to avoid conflicts)
    const {rows: rows2} = await client.query(`
      UPDATE cart SET "isActive" = false
      WHERE id =$1
      RETURNING *;
    `,[cartId]);
      console.log("hunh", rows2);

    // create a new cart based on user 
    const newCart = await createCart({userId,isActive:true,totalPrice:0})
      console.log(newCart);
    return rows, rows2
  }catch(error){
    console.log(error)
  }
}

module.exports={
    createCart,
    deleteCart,
    // getCartsByUserId,
    getActiveCartByUserId,
    obliterateAllCartDetails,
    totalPricer,
    purchaseCart
}