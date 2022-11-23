const { client } = require(".")

async function createProduct({
    title, description, price, quantity
}){
    console.log("lets creating product ");
    try{
    const{rows: [product]} = await client.query(`
        INSERT INTO products(title, description, price, quantity)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
        `,[title, description, price, quantity ]);
        console.log( product, "has been created");
        return product;
    } catch(error){
        console.log(error)
    }
}

module.exports={
    createProduct
}