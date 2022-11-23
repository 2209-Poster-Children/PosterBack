const { client } = require(".")

async function createCart({
    productId, quantity, subtotal, priceBoughtAt
}){
    console.log("lets make a cart");
    try{
    const{rows: [cart]} = await client.query(`
        INSERT INTO carts("productId", quantity, subtotal, "priceBoughtAt")
        VALUES ($1,$2,$3, $4)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
        `,[productId, quantity, subtotal, priceBoughtAt]);
        console.log( cart, "has been created");
        return cart;
    } catch(error){
        console.log(error)
    }
}

module.exports={
    createCart
}