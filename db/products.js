const { client } = require(".")


// update product (having issues with the product return values... talk to matt?)
async function createProduct({
    title, description, price, quantity,imageUrl,imageAlt,categoryId
}){
    //if imageUrl is null or imageAlt is null just set them to a null value otherwise I have to change psql pass ins and I'm a tad lazy also that code is even more code
    if (imageUrl == null) imageUrl = 'https://http.cat/404'
    if (imageAlt == null) imageAlt = 'This is an image of a poster'
    
    try{ 
    const {rows: [products] } = await client.query(`
        INSERT INTO products(title, description, price,"imageUrl", quantity,"imageAlt","categoryId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
        `,[title, description, price, imageUrl, quantity,imageAlt, categoryId]);

    return products;
    } catch(error){
        console.log(error)
    }
}

//we're making a fields and inserting into the request and the data for each update added.
async function updateProduct(
   id, fields={}
){// talk with teachers to make this one more secure.
    try{
        console.log(fields)
        const setString= Object.keys(fields).map((key,index)=> `
        "${key}"=$${index+1}`).join(`, `)
        const {rows:[products]}= await client.query(`
            UPDATE products SET ${setString}
            WHERE id = $1
            RETURNING *;`,Object.values(fields))
        return products
    }catch(error){
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

async function getAllProducts(page, count){
    console.log("getting all products")
    try{
        const offset = count*(page-1);
        const{rows} = await client.query(`
            SELECT categories.name AS "categoryName", products.* FROM products
            LEFT JOIN categories ON categories.id = products."categoryId"
            LIMIT $1 OFFSET $2;
            `, [count, offset]);
        
        console.log(rows);
        return rows; 
    }catch(error){
        console.log(error);
    }
}

async function getProductByTitle(titles){
    console.log("getting tables by title "+titles)
    try{
        const{rows: [product]} = await client.query(`
            SELECT * FROM products
            WHERE LOWER(title) = LOWER($1);`
            ,[titles])
        console.log(product);
        return product
    } catch(error){
        console.log(error);
    }
}

async function getProductPrice(id){
    try{
        const {rows:[price]} = await client.query(`
            SELECT price FROM products
            WHERE id = $1;`,
            [id])
        console.log(price)
        return price;
    }catch(error){
        console.log(error)
    }
}

async function deleteProduct(id){
    try {
      const rows = await client.query(`
        DELETE FROM products
        WHERE id=$1
        RETURNING *;
        `, [id]);
    return rows, "product has been removed";
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
    updateProduct,
    getProductPrice
}