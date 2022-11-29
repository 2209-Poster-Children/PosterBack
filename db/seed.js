const{client} = require('./index');
const{createUser, getAllUsers, createAdminUser} = require('./users');
const{createProduct, getProductById, getAllProducts, getProductByTitle} = require('./products');
const { createAddress } = require('./address');
const { createCart,getCartsByUserId, getActiveCartByUserId } = require('./cart');
const{addItemToCartDetails,getCartDetailsByCart,addQuantityToCart, removeItemFromCartDetails}=require ('./cartDetails')
const { createReview } = require('./reviews');


async function createTables(){
    console.log("┬─┬ノ( º _ ºノ) creating lots of tables...");
    //notes on products genre(catagories) and img link??
    try{
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            "isAdmin" BOOLEAN default false
        );
        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC,
            quantity INTEGER,
            "imageUrl" VARCHAR(500),
            "imageAlt" VARCHAR(255) default 'poster'
        );
        CREATE TABLE address(
            id SERIAL PRIMARY KEY,
            address VARCHAR(255) NOT NULL,
            zipcode INTEGER NOT NULL,
            state VARCHAR(2) NOT NULL,
            city VARCHAR(255) NOT NULL,
            "userId" INTEGER REFERENCES users(id),
            "primaryAddress" BOOLEAN default true
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

        const ian = await createAdminUser({username:'Ian',password:'NoctisLuciusK1ng!',isAdmin:true})
        const madi = await createAdminUser({username:'Madi',password:'ThisIsMadisPassword',isAdmin:true})
        const drew = await createAdminUser({username:'Drewford',password:'Drewford',isAdmin:true})
        const yeisi = await createAdminUser({username:'Yeisi',password:'IansPassword',isAdmin:true});

        console.log(shakira,cantinflas,ke$ha);
        console.log("success creating users!")
    }catch(error){
        console.log(error)
    }
}

async function createInitialProducts(){
    try{
        console.log('creating initial products');
        const scottPilgrim = await createProduct({title:'Scott Pilgrim',description:'Why is he dressed like a pirate?',price:20.00,quantity:300, imageUrl:"https://m.media-amazon.com/images/I/51FrvGUJD3L._AC_SY580_.jpg"})
        const akira = await createProduct({title:'Akira',description:'Two boys get psykinesis and then a baby explodes',price:20.00, quantity:1000,imageUrl:"https://ih1.redbubble.net/image.1024303529.4101/flat,750x,075,f-pad,750x1000,f8f8f8.jpg",imageAlt:"A teenager walks towards a motorcycle and there's lots of red"})
        const jackieBrown = await createProduct({title:'Jackie Brown', description:'A middle aged airline stewardess who supplements her income by smuggling arms for a kingpin',price:20.00, quantity:1234})
        const theOutsiders = await createProduct({title:'The Outsiders', description:'Tom Cruise in his first role', price:50.00, quantity:10, imageUrl:'https://i.pinimg.com/564x/09/5f/60/095f6087b2690db76e2678b499b82fac.jpg'});
        const theSilenceOfLambs = await createProduct({ title:'The Silence of The Lambs',description:'disturbing Old Man eats people ',price:20, quantity:10,imageUrl:'https://i.pinimg.com/474x/a3/df/37/a3df374e001e0232d1522dc69145ffd3.jpg'})
        const alienET = await createProduct({ title:'E.T',description:' EEEEE.TTTTTT ',price:20.00,quantity:10, imageUrl:'https://i.pinimg.com/474x/f6/23/07/f623079bcc02b49ab9a839b239c81b9d.jpg' })
        const westSideStory = await createProduct({ title:'West Side Story', description:'A rivalry between ethnic backgrounds *Eyeroll* ', price:10.00,quantity:10, imageUrl:'https://i.pinimg.com/564x/83/b2/a0/83b2a0298f4a5c18278aefa9a440ae43.jpg'})
        const littleWomen = await createProduct({ title:'Little Women',description:'4 sisters',price:25.00,quantity:20, imageUrl:'https://i.pinimg.com/564x/a1/ae/90/a1ae90417b7e8a037ad20b16392ce17e.jpg'})
        const ladyOnFire = await createProduct({ title: 'Portrait of a Lady On Fire', description:' ouch',price:20.00,quantity:10, imageUrl: 'https://cdn.shopify.com/s/files/1/0275/8351/2681/products/PLF_AkikoPoster_2000x@2x.progressive.jpg?v=1654199751'})
        const blackSwan =await createProduct({title:'Black Swan',description:'A confusing movie dont watch when a toddler', price:20.00,quantity:10,imageUrl:'https://i.pinimg.com/564x/ce/0c/ff/ce0cff6131d1c7946aa514f7b6748fa2.jpg',imageAlt:"an image of the poster for black swan" })
        const hereditary =await createProduct({ title:'Hereditary',description:'A WTF kind of movie', price:15.00, quantity:10, imageUrl:'https://i.pinimg.com/564x/89/a6/e0/89a6e080474623cf3bfce05163fac57b.jpg'})
        const midSommar =await createProduct({ title:'Midsommar',description:'Culty',price:20.00,quantity:15,imageUrl:'https://i.pinimg.com/564x/bb/ab/1c/bbab1ca03a8b81457c02133c4f0a365d.jpg'})
        const everythingEverywhere = await createProduct({ title: 'Everything Everywhere All At Once', description:'crazy', price:20.00, quantity:15, imageUrl:'https://i.pinimg.com/564x/43/4d/be/434dbe2df3ad3afeccb0011659e978bf.jpg'})
        const spiderMan = await createProduct({ title:'Spiderman Into The Spiderverse', description:' Miles Morales', price:20.00,quantity:15, imageUrl:'https://i.pinimg.com/564x/c4/b0/b3/c4b0b31635fb0c935271c979f2d3bcf7.jpg'})
        const wolfOfWalls=await createProduct({ title: 'Wolf Of Wallstreet',description:'self explanatory', price:20.00,quantity:10, imageUrl:'https://i.pinimg.com/564x/27/d5/db/27d5db11ab103f957a14949b64d09cfb.jpg'})
        const barbarian =await createProduct({ title:'Barbarian', description:'Airbnb nightmare', price:25.00, quantity:15, imageUrl:'https://i.pinimg.com/564x/5a/4f/68/5a4f6895951d37ff5da9832727606ea8.jpg'})
        const bleachers =await createProduct({ title:' The Bleachers',description:'Band',price:20.00,quantity:20,imageUrl:'https://i.pinimg.com/564x/04/a0/9c/04a09c7b371408dfb0d617f7a97110cf.jpg'})
        const arcticMonkeys=await createProduct({title:'Arctic Monkey',description:'Band', price:20.00,quantity:12, imageUrl:'https://i.pinimg.com/564x/22/61/59/226159347177904e4de8779f3c097b7b.jpg'})
        const szaa=await createProduct({title:'sza', description:'Artist',price:25.00, quantity:10, imageUrl:'https://i.pinimg.com/474x/18/fd/2c/18fd2c38f5cf7d4e124a7c7792e99c41.jpg '})
        const theWeeknd =await createProduct({title:'The Weeknd', description:'sad- mf',price:25.00,quantity:23, imageUrl:'https://i.pinimg.com/564x/bf/62/bb/bf62bb91015676488c5adda1251d997d.jpg' })
        
        console.log(scottPilgrim,akira, jackieBrown,theOutsiders,theSilenceOfLambs,alienET,westSideStory,littleWomen,ladyOnFire,blackSwan)

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
        const drewfordAddress = await createAddress({address:"1234 Streetname", zipcode: 78501, state:"TX", city: "McAllen", userId:6});
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
        const ianCart = await createCart({userId:4, isActive:true, totalPrice:3000});
        const ianCart2 = await createCart({userId:4, isActive:false, totalPrice: 10000});
    } catch(error){
        console.log(error);
    }
}

async function createInitialCartDetails() {
    const IansCartDetailsOne =await addItemToCartDetails({cartId:4, productId:2, quantity:2,priceBoughtAt:0})
    const IansCartDetailsTwo =await addItemToCartDetails({cartId:4,productId:20,quantity:1, priceBoughtAt:0})

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
        // await getCartsByUserId(4);
        // await getActiveCartByUserId(4);
        await getCartDetailsByCart(4);
        // await removeItemFromCartDetails(2);
        await addQuantityToCart(4,2,3);
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
    await createInitialCartDetails();
    await testDB();
    client.end();
}

rebuildDB();