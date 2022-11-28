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



module.exports= {addItemToCartDetails}