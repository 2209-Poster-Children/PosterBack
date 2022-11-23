const{client} = require('./index');
const{createUser, getAllUsers} = require('./users');
const{createProduct, getProductById, getAllProducts, getProductByTitle} = require('./products');
const { createAddress } = require('./address');
const { createCart } = require('./cart');
const { createReview } = require('./reviews');

async function createTables(){
    console.log("┬─┬ノ( º _ ºノ) creating lots of tables...");
    //notes on products genre and img link??
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
            quantity INTEGER,
            "imageUrl" VARCHAR(255) default 'https://http.cat/404'
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
        );
        CREATE TABLE catagories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) UNIQUE NOT NULL,
            "productId" INTEGER REFERENCES products(id)
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
        DROP TABLE IF EXISTS catagories;
        DROP TABLE IF EXISTS "cartDetails";
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS address;
        DROP TABLE IF EXISTS users;
        `)
        console.log("...┻━┻︵ \(°□°)/ ︵ ┻━┻ all tables dropped!")
    }catch(error){
        console.log(error)
    }
}

async function createInitialUsers(){
    try{
        console.log("≋≋≋≋≋̯̫⌧̯̫(ˆ•̮ ̮•ˆ)creating initial users...")
        const shakira = await createUser({username:'shakiraHips',password:'beyonce' })
        const cantinflas = await createUser({username:'cantinflas', password:'soGo0d'})
        const ke$ha = await createUser({username:'ke$ha',password:'thepartydontStart'})
        console.log(shakira,cantinflas,ke$ha);
        console.log("success creating users!")
    }catch(error){
        console.log(error)
    }
}

async function createInitialProducts(){
    try{
        console.log('creating initial products');
        const scottPilgrim = await createProduct({title:"Scott Pilgrim",description:"Why is he dressed like a pirate?",price:20.00,quantity:300})
        const akira = await createProduct({title:"Akira",description:"Two boys get psykinesis and then a baby explodes",price:20.00, quantity:1000})
        const jackieBrown = await createProduct({title:"Jackie Brown", description:"A middle aged airline stewardess who supplements her income by smuggling arms for a kingpin",price:20.00, quantity:1234})
        const theOutsiders = await createProduct({title:"The Outsiders", description:"Tom Cruise in his first role", price:50.00, quantity:10});
        console.log(scottPilgrim,akira, jackieBrown,theOutsiders )

    } catch(error){
        console.log(error);
    }
}

async function createInitialAddress(){
    try{
        console.log("creating initial addresses")
        const newYork = await createAddress({address:"1681 Broadway",zipcode:10019,state:"NY",city:"New York",userId:1})
        const quinta = await createAddress({address:"600 Sunset Dr",zipcode:78503,state:"TX",city:"McAllen",userId:2})
        const miami = await createAddress({address:"3140 North Bay Road",zipcode:33140,state:"FL",city:"Miami Beach",userId:3});
        console.log("address created")
    } catch(error){
        console.log(error)
    }
}
    
async function createInitialCart(){
    console.log("creating initial cart...")
    try{
        const shakiraCart = await   createCart({userId:1,isActive:false,totalPrice:40.01})
        const cantinflasCart = await createCart({userId:2,isActive:true,totalPrice:40})
        const ke$haCart = await createCart({userId:3,isActive:true,totalPrice:60})
    } catch(error){
        console.log(error);
    }
}

async function createInitialReviews(){
    console.log("creating initial reviews...")
    try{
        const itCameInRipped = await createReview({userId:1,productId:2,title:"It came in ripped",description:"My poster must've been delivered by a crazy dude, because it came in the mail ripped, but the company was willing to replace it for free! Thanks poster-children!"})
        const highQuality = await createReview({userId:2,productId:3,title:"Very Shiny high quality",description:"My poster was glittering and bright! I love it!"})
        const cheapAndGood = await createReview({userId:3,productId:1,title:"Hung it up right away..!", description:"I had to go buy a poster frame for this amazing poster right away and hung it up in my living room!" })
    }catch(error){
        console.log(error);
    }
}

async function testDB(){

        console.log("testing the database")
        // await getAllUsers();
        // await getProductById(1);
        // await getAllProducts();
        // await getProductByTitle('Scott Pilgrim');
        
}

async function rebuildDB(){
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialAddress();
    await createInitialCart();
    await createInitialReviews();
    await testDB();
    client.end();
}

rebuildDB();