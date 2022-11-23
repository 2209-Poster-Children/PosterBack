const { client } = require(".")

async function createReview({
    userId, productId, title, description
}){
    console.log("lets create a review ");
    try{
    const{rows: [review]} = await client.query(`
        INSERT INTO reviews("userId","productId", title, description)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (title) DO NOTHING
        RETURNING *;
        `,[userId, productId, title, description]);
        console.log( review, "has been created");
        return review;
    } catch(error){
        console.log(error)
    }
}

module.exports={
    createReview
}

