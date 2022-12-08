const { client } = require(".")
const bcrypt = require('bcrypt');

//sure I could rewrite the hasher because credit card data is the most sensitive.
async function generateHashedValue(valueToHash){
    try{

        const saltValue = await bcrypt.genSalt(10);
        const valueToHash2 = valueToHash.toString();
        console.log(valueToHash, "   ", valueToHash2);
        const hashedValue = await bcrypt.hash(valueToHash2,saltValue)
        return hashedValue;
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

async function getAllCreditCardsByUser(
    userId
){
    try{
    const{ rows }= await client.query(`
    SELECT * FROM "creditCard" WHERE "userId" =$1;
    `,userId)

    return rows;
    }catch(error){
        console.log(error)
    }
}

async function getActiveCreditCardByUser(userId){
    try{
        const {rows:[credit]}= await client.query(`
        SELECT * FROM "creditCard" WHERE "userId" =$1
        AND "isActive" = true;`
        ,[userId])

        return credit;
    }catch(error){
        console.log(error);
    }
}

module.exports={addCreditCard, getActiveCreditCardByUser, getAllCreditCardsByUser}