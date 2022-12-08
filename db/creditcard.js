const { client } = require(".")
const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const initVector = crypto.randomBytes(16);

const Securitykey = crypto.randomBytes(32);

//sure I could rewrite the hasher because credit card data is the most sensitive.


async function addCreditCard({
    creditNumber, CVV, expiration, name, zipcode, userId
}){
    //hashes the credit number
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(creditNumber, "utf-8", "hex")

    encryptedData += cipher.final("hex");

    console.log("encryptedCard ", encryptedData);
    creditNumber = encryptedData;
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

        const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector)

        let decryptedData = decipher.update(credit.creditNumber, "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        credit.creditNumber = decryptedData;
        return credit;
    }catch(error){
        console.log(error);
    }
}

module.exports={addCreditCard, getActiveCreditCardByUser, getAllCreditCardsByUser}