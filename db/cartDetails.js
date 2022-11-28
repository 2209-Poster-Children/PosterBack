const {client}= require ('.')
const {getProductPrice}=require('./products')

async function addItemToCartDetails({cartId,productId,quantity,priceBoughtAt}){
    try{
        const {price} = await getProductPrice(productId)
        const subtotal= price*quantity
        console.log(subtotal,'this is sub')
        const {rows:[cartDetails]}=await client.query(`
            INSERT INTO "cartDetails"("cartId","productId",quantity,subtotal,"priceBoughtAt")
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
            `, [cartId,productId,quantity,subtotal,priceBoughtAt])
        console.log(cartDetails)
        return cartDetails
    }catch(error){
        console.log(error)
    }
}

async function removeItemFromCartDetails(productId){
    try{
        const itemRemove = await client.query(`
            DELETE FROM "cartDetails" WHERE "productId"=${productId}`)
        console.log("cartItemDeleted #",productId)
        return itemRemove
    }catch(error){
        console.log(error);
    }
}

async function getCartDetailsByCart(cartId){
    try{
        const {rows} = await client.query(`
        SELECT * FROM cart
        RIGHT JOIN "cartDetails"
        ON cart.id = "cartDetails"."cartId"
        WHERE "cartDetails"."cartId" = $1;
        `,[cartId])
        console.log(rows);
        return rows;
        
    }catch(error){
        console.log(error)
    }
}

//add quanitity to cart

module.exports= {
    addItemToCartDetails, 
    getCartDetailsByCart,
    removeItemFromCartDetails}