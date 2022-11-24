const { client } = require(".")
// update product
async function createProduct({
    title, description, price, quantity,imageUrl
}){
    console.log("lets creating product ");
    try{
    const{rows: [product]} = await client.query(`
        INSERT INTO products(title, description, price, quantity, "imageUrl")
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
        `,[title, description, price, quantity,imageUrl ]);
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

async function getProductByTitle(titles){
    console.log("getting tables by title "+titles)
    try{
        const{rows} = await client.query(`
        SELECT * FROM products
        WHERE title = $1;`
        ,[titles])
        console.log(rows);
        return rows
    } catch(error){
        console.log(error);
    }
}

async function deleteProduct(id){
    try {
      await client.query(`
        DELETE FROM products
        WHERE id=$1
        RETURNING *;
        `, [id]);
  
        return id, "product has been removed";
    } catch (error) {
      console.log(error);
    }
  }

module.exports={
    createProduct,
    getProductById,
    getAllProducts,
    getProductByTitle,
    deleteProduct
}