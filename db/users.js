const { client } = require(".");
const bcrypt = require('bcrypt');
const { createCart } = require("./cart");

// create a bcrypt hasher and use it to pass password values.
async function generateHashedValue(valueToHash){
    try{
        // create a salt value to append to the hashed value
        const saltValue = await bcrypt.genSalt(10);
        // hash the value and the salt value
        const hashedValue = await bcrypt.hash(valueToHash,saltValue)
        return hashedValue;
    }catch(error){
        console.log(error)
    }
}

//create user also creates a new cart for the new user.
async function createUser({
    username,
    password
}){
    //hashes the password 
    password = await generateHashedValue(password)
    try{
        // we add the hashed password and username to the database, and ignore conflicts.
        const{ rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING*;
        `,[username, password]);
        // console.log(user , "has been created");
        // then we create a cart for the new user and don't return that data
        await createCart({userId:user.id,isActive:true,totalPrice:0});

        return {username: user.username, id: user.id};
    } catch(error){
        console.log(error);
    }
}

// this password should run seed side only (as far as we're working anyway) and does the same as create user but assigns admin as well.
async function createAdminUser({
    username,
    password,
    isAdmin
}){
    try{
        password = await generateHashedValue(password);
        const{ rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password,"isAdmin")
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        RETURNING*;
        `,[username, password,isAdmin]);
        // console.log(user , "admin has been created");
        await createCart({userId:user.id,isActive:true,totalPrice:0});
        return user;
        
    } catch(error){
        console.log(error);
    }
}

//checks user for valid input, username, password using bcrypt
async function getUser(
    username,password
){
    // console.log("checkin user credentials")
    try{
        const { rows:[user] } = await client.query(`
        SELECT * FROM users 
        WHERE username =$1;
        `,[username])
        // if compare == true return user.username and id else return nothing
        const passwordsMatch = await bcrypt.compare(password,user.password)
        if ( passwordsMatch ) return {name:user.username, id:user.id}
        else return;
    } catch(error){
        console.log(error);
    }
}

// getUserByUsername grabs a username for verification 
async function getUserByUsername(
    username
){
    // console.log("getting user...")
    try{
        const { rows: [ user ] } = await client.query(`
        SELECT username, id FROM users
        WHERE username = $1;
        `,[username]);
        // console.log("user " , user)
        return user;
    } catch(error){
        console.log("there was an error getting the user...")
        throw error;
    }
}

// get user by ID checks for a user via the userId only returns id, username
async function getUserById(
    id
){
    // console.log("calling getUserByID...")
    try{
        if (!id){
            return null
        }
        const { rows: [ user ] } = await client.query(`
            SELECT id, username FROM users WHERE id=$1
            `,[id]);

        return user;
    } catch(error){
        console.log("error with get user by id");
    }
}

// Either delete or do not acces func after testing
 async function getAllUsers(){
        // console.log("getting all users");
    try{
        const {rows} =await client.query(`
        SELECT * FROM users;
        `)
        // console.log(rows);
        return rows
    }catch(error){
        console.log(error);
    }
};

// checks for isAdmin true on a user for admin privledges
async function checkUserAdminStatus(username){
    console.log("checking admin status")
    try{
        const {rows:[isAdmin]} = await client.query(`
        SELECT "isAdmin" FROM users
        WHERE username =$1;
        `,[username])
        // console.log(isAdmin.isAdmin);
        if(isAdmin.isAdmin == true){ return isAdmin.isAdmin}
        
        else return {name:"ACCESS DENIED", message:"YOU DO NOT HAVE THE PERMISSIONS FOR THIS API FUNCTION"}
    } catch(error){
        console.log(error)
    }
}
module.exports={ createUser,getAllUsers,
    getUser, getUserByUsername, getUserById,
    checkUserAdminStatus,createAdminUser}