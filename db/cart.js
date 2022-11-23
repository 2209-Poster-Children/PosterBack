const { client } = require(".")

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

module.exports={
    createCart
}