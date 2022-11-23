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

async function deleteReview(id){
  try {
    await client.query(`
      DELETE FROM reviews
      WHERE id=$1
      RETURNING *;
      `, [id]);

      return id, "review has been DESTROYED!";
  } catch (error) {
    console.log(error);
  }
}

module.exports={
    createReview,
    deleteReview
}

