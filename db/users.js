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

async function getUser(
    username,password
){
    console.log("checkin user credentials")
    try{
        // console.log("here!!!", username," ",password);
        const { rows:[user] } = await client.query(`
        SELECT * FROM users 
        WHERE username =$1;
        `,[username])
        // console.log("rows.obj ", user);
        if(user.username == username && user.password == password ) return user
        else{return "user and or password incorrect!"};
    } catch(error){
        console.log(error);
    }
}

async function getUserByUsername(
    username, password 
){
    console.log("getting user...")
    try{
        const { rows: [ user ] } = await client.query(`
        SELECT * FROM users
        WHERE username = $1;
        `,[username]);
        if(password != user.password) return "wrong password, try again Shakira."
        console.log("user " , user)
        return {user: { id,username } };
    } catch(error){
        console.log("there was an error getting the user...")
        throw error;
    }
}

// Either delete or do not acces func after testing
 async function getAllUsers(){
        console.log("getting all users");
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

module.exports={ createUser,getAllUsers,
    getUser, getUserByUsername}