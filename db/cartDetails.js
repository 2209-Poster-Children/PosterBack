const {client}= require ('.')
const { totalPricer } = require('./cart')
const {getProductPrice}=require('./products')

async function addItemToCartDetails({cartId,productId,quantity}){
    try{
        const {price} = await getProductPrice(productId)
        const subtotal= price*quantity

        console.log(subtotal,'this is sub')
        const {rows:[cartDetails]}=await client.query(`
            INSERT INTO "cartDetails"("cartId","productId",quantity,subtotal)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
            `, [cartId,productId,quantity,subtotal])
        console.log(cartDetails)
        //set totalPrice on Cart
        const newPrice = await totalPricer(cartId);
        return cartDetails
    }catch(error){
        console.log(error)
    }
}

async function removeItemFromCartDetails(productId,cartId){
    try{
        const itemRemove = await client.query(`
            DELETE FROM "cartDetails" WHERE
            "productId"=$1 AND "cartId" = $2`
            ,[productId,cartId])
        console.log("cartItemDeleted #",productId)
        //set totalPrice on cart.
        const newPrice= await totalPricer(cartId);
        return itemRemove
    }catch(error){
        console.log(error);
    }
}

async function getCartDetailsByCart(cartId){
    //talk to the team about the join query
    try{
        const {rows} = await client.query(`
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
        WHERE "cartDetails"."cartId" = $1
        GROUP BY cart.id, "cartDetails"."cartId";
        `,[cartId])
        console.log(rows);
        return rows;
        
    }catch(error){
        console.log(error)
    }
}

// priceBoughtAt should default to 0 until purchased then it will sit at the subtotal value.
async function addQuantityToCart(cartId, productId, quantity){
    try{
        const {price} = await getProductPrice(productId)
        const subtotal = price*quantity

        const {rows} = await client.query(`
            UPDATE "cartDetails" SET quantity= $1, subtotal = $2
            WHERE "productId" =$3 AND "cartId" =$4
            RETURNING *;
            `,[quantity,subtotal,productId,cartId])
        console.log(rows);
        //set totalPrice on cart
        const newPrice = totalPricer(cartId);
        return rows
    }catch(error){
        console.log(error);
    }
}

//add quanitity to cart

module.exports= {
    addItemToCartDetails, 
    getCartDetailsByCart,
    removeItemFromCartDetails,
    addQuantityToCart
}