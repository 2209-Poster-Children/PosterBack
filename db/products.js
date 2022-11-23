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

async function getProductById(id){
    console.log("getting product by id#", id);
    try{
        const{rows: [product]}= await client.query(`
        SELECT * FROM products
        WHERE id = $1;
        `,[id]);
        console.log("here is my product ",product)
        return product; 
    }catch(error){
        console.log(error)
    }
}

async function getAllProducts(){
    console.log("getting all products")
    try{
        const{rows} = await client.query(`
        SELECT * FROM products;
        `);
        console.log(rows);
        return rows; 
    }catch(error){
        console.log(error);
    }
}
async function getProductByTitle(title){
    console.log("getting tables by title "+title)
    try{
        const{rows: [titl]} = await client.query(`
        SELECT * FROM products
        WHERE title = $1;`
        ,[title])
        console.log(titl);
        return titl
    } catch(error){
        console.log(error);
    }
}

module.exports={
    createProduct,
    getProductById,
    getAllProducts,
    getProductByTitle
}