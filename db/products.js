const { client } = require(".")
// update product (having issues with the product return values... talk to matt?)
async function createProduct({
    title, description, price, quantity,imageUrl
}){
    if (imageUrl == null) imageUrl = 'https://http.cat/404'
    try{
    const {rows: [products] } = await client.query(`
        INSERT INTO products(title, description, price,"imageUrl", quantity)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
        `,[title, description, price, imageUrl, quantity ]);
        return products;
    } catch(error){
        console.log(error)
    }
}

async function updateProduct(
   id, fields={}
){console.log(fields)
     const setString= Object.keys(fields).map((key,index)=> `
    "${key}"=$${index+1}`).join(`, `)
    const {rows:[products]}= await client.query(`
        UPDATE products SET ${setString}
        WHERE id = ${id}
        RETURNING *;`,Object.values(fields))

 return products
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
    deleteProduct,
    updateProduct
}