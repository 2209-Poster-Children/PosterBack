const{client} = require('./index');

async function createTables(){
    console.log("┬─┬ノ( º _ ºノ) creating lots of tables...");
    try{
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255)
        );
        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC,
            quantity INTEGER
        );
        CREATE TABLE address(
            id SERIAL PRIMARY KEY,
            address VARCHAR(255) NOT NULL,
            zipcode INTEGER NOT NULL,
            state VARCHAR(2) NOT NULL,
            city VARCHAR(255) NOT NULL,
            "userId" INTEGER REFERENCES users(id) 
        );
        CREATE TABLE cart(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "isActive" BOOLEAN DEFAULT true,
            "totalPrice" NUMERIC
        );
        CREATE TABLE "cartDetails"(
            "cartId" INTEGER REFERENCES cart(id),
            "productId" INTEGER REFERENCES products(id),
            quantity INTEGER,
            subtotal NUMERIC,
            "priceBoughtAt" NUMERIC
        );
        CREATE TABLE reviews(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "productId" INTEGER REFERENCES products(id),
            title VARCHAR(255)UNIQUE NOT NULL,
            description TEXT NOT NULL
        )`)

        console.log("...┏━┓┏━┓┏━┓ ︵ /(^.^/) tables successfully created!")
    }catch(error){
        console.log(error)
    }
}

async function dropTables(){
    console.log("(┛◉Д◉)┛彡┻━┻ dropping all tables...")
    try{
        await client.query(`
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS cartDetails;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS address;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        `)
        console.log("...┻━┻︵ \(°□°)/ ︵ ┻━┻ all tables dropped!")
    }catch(error){
        console.log(error)
    }
}

async function rebuildDB(){
    client.connect();
    await dropTables();
    await createTables();
    client.end();
}

rebuildDB();