const { client } = require(".");

//assign categories in the database table categories to productid's

async function createCategory(name){
    const categoryNameLower = name.toLowerCase();
    try{
        const {rows: [category] } = await client.query(`
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING *;
        `,[categoryNameLower])

        return category;
    }catch(error){
        console.log(error);
    }
}


module.exports={
    createCategory
}