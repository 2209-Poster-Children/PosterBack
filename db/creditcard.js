const { client } = require(".")
const bcrypt = require('bcrypt');

//sure I could rewrite the hasher because credit card data is the most sensitive.
async function generateHashedValue(valueToHash){
    try{

        const saltValue = await bcrypt.genSalt(14);
        valueToHash = valueToHash.toString();
        const hashedValue = await bcrypt.hash(valueToHash,saltValue)
    }catch(error){
        console.log(error)
    }
}

async function addCreditCard({
    creditNumber, CVV, expiration, name, zipcode, userId
}){
    //hashes the credit number
    creditNumber = await generateHashedValue(creditNumber)
    try{
        const{ rows: [ creditCard ] } = await client.query(`
        INSERT INTO "creditCard"("creditNumber", "CVV", expiration, name, zipcode,"userId")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,[creditNumber, CVV, expiration, name, zipcode, userId])

        return creditCard
    }catch(error){
        console.log(error);
    }
}

module.exports={addCreditCard}