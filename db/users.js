const { client } = require(".");

async function createUser({
    username,
    password
}){
    //password hasher? (hash that pass)
    // saltyMeter = 7;
    // const hashedPassword = await bcrypt.hash(password,saltyMeter)
    try{
        const{ rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING*;
        `,[username, password]);
        console.log(user , "has been created");
        return user;
        
    } catch(error){
        console.log(error);
    }
}
// Either delete or do not acces func after testing
 async function getAllUsers(){
        console.log("getting all users loser");
    try{
        const {rows} =await client.query(`
        SELECT * FROM users;
        `)
        console.log(rows);
        return rows
    }catch(error){
        console.log(error);
    }
};

module.exports={ createUser,getAllUsers}