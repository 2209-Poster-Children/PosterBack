const {client} = require('./index');
const {createUser, getAllUsers, createAdminUser} = require('./users');
const {createProduct, getProductById, getAllProducts,
       getProductByTitle} = require('./products');
const {createAddress} = require('./address');
const {createCart, getCartsByUserId, 
       getActiveCartByUserId, deleteCart,totalPricer,
       purchaseCart } = require('./cart');
const {addItemToCartDetails,getCartDetailsByCart,
       addQuantityToCart, removeItemFromCartDetails}=require ('./cartDetails')
const {createReview} = require('./reviews');
const { createCategory } = require('./categories');
const { addCreditCard } = require('./creditcard');


async function createTables(){
    console.log("┬─┬ノ( º _ ºノ) creating lots of tables...");
    //notes on products genre(categories) and img link??
    try{
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            "isAdmin" BOOLEAN default false
        );
        CREATE TABLE categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) UNIQUE NOT NULL
        );
        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC(10,2),
            quantity INTEGER,
            "imageUrl" VARCHAR(500),
            "imageAlt" VARCHAR(255) default 'poster',
            "categoryId" INTEGER REFERENCES categories(id)
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
            "priceBoughtAt" NUMERIC DEFAULT 0,
            UNIQUE ("cartId","productId")
        );
        CREATE TABLE reviews(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "productId" INTEGER REFERENCES products(id),
            title VARCHAR(255)UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        `)
        // CREATE TABLE "creditCard"(
        //     id SERIAL PRIMARY KEY,
        //     "creditNumber" VARCHAR(255),
        //     "CVV" VARCHAR(255),
        //     expiration VARCHAR(255),
        //     name VARCHAR(255),
        //     zipcode INTEGER,
        //     active BOOLEAN DEFAULT true,
        //     "userId" INTEGER REFERENCES users(id)
        // );

        console.log("...┏━┓┏━┓┏━┓ ︵ /(^.^/) tables successfully created!")
    }catch(error){
        console.log(error)
    }
}

async function dropTables(){
    console.log("(┛◉Д◉)┛彡┻━┻ dropping all tables...")
    try{
        await client.query(`
        DROP TABLE IF EXISTS "cartDetails";
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS "creditCard";
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS address;
        DROP TABLE IF EXISTS users;
        `)
        console.log("...┻━┻︵ \(°□°)/ ︵ ┻━┻ all tables dropped!")
    }catch(error){
        console.log(error)
    }
}
let movies = "";
let music
let videogames
async function createInitialCategories(){
    try{
        movies = await createCategory("movies");
        music = await createCategory("music");
        videogames = await createCategory("videogames");
        console.log("category stuff " , movies,music,videogames);
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
        const jennA=await createUser({username:'Jennifer', password:'anniston'})
        const shrekS = await createUser({username:'Shreksss',password:'Shrek+Fiona'})
        const fionaFFA = await createUser({username:'FionaFf',password:'FIONAfaRfArAwaY'})
        const jefferyD = await createUser({username:'LoveHearts',password:'IeatHarts'})
        const katyP = await createUser({username:'FireWork',password:'TeenageDream'})
        const donkayyy = await createUser({username:'Donkayy',password:'shrekLOVESmemore'})
        const madonna = await createUser({username:'likeaVirgin',password:'whatwouldMadonnaSay'})
        const gwenS =await createUser({username:'hollaBack',password:'GIRLLL'})
        const johnCena= await createUser({username:'theChampIShere',password:'youcantseeme'})
        const canadian = await createUser({username:'Aiye',password:'ithinkthatshowsyouspellit'})
        const ettt = await createUser({username:'alien001',password:'E.tttttttt'})

        const ian = await createAdminUser({username:'Ian',password:'NoctisLuciusK1ng!'})
        const madi = await createAdminUser({username:'Madi',password:'spiderman'})
        const drew = await createAdminUser({username:'Drewford',password:'Drewford'})
        const yeisi = await createAdminUser({username:'Yeisi',password:'IansPassword'});

        console.log(shakira,cantinflas,ke$ha);
        console.log("success creating users!")
    }catch(error){
        console.log(error)
    }
}

async function createInitialProducts(){
    try{
        console.log('creating initial products');
        const scottPilgrim = await createProduct({title:'Scott Pilgrim',description:'Why is he dressed like a pirate?',price:20.00,quantity:300, imageUrl:"https://m.media-amazon.com/images/I/51FrvGUJD3L._AC_SY580_.jpg",categoryId:movies.id})
        const akira = await createProduct({title:'Akira',description:'Two boys get psykinesis and then a baby explodes',price:19.99, quantity:1000,imageUrl:"https://ih1.redbubble.net/image.1024303529.4101/flat,750x,075,f-pad,750x1000,f8f8f8.jpg",imageAlt:"A teenager walks towards a motorcycle and there's lots of red",categoryId:movies.id})
        // const jackieBrown = await createProduct({title:'Jackie Brown', description:'A middle aged airline stewardess who supplements her income by smuggling arms for a kingpin',price:20.00, quantity:1234,imageUrl:'https://64.media.tumblr.com/b4d620407729df479ff3c5d4e6a9908c/tumblr_pdgfdrLrpB1s80h8lo1_1280.jpg',categoryId:movies.id})
        const theOutsiders = await createProduct({title:'The Outsiders', description:'Tom Cruise in his first role', price:50.00, quantity:10, imageUrl:'https://i.pinimg.com/564x/09/5f/60/095f6087b2690db76e2678b499b82fac.jpg',categoryId:movies.id});
        const theSilenceOfLambs = await createProduct({ title:'The Silence of The Lambs',description:'disturbing Old Man eats people ',price:20, quantity:10,imageUrl:'https://i.pinimg.com/474x/a3/df/37/a3df374e001e0232d1522dc69145ffd3.jpg',categoryId:movies.id})
        const alienET = await createProduct({ title:'E.T',description:' EEEEE.TTTTTT ',price:20.00,quantity:10, imageUrl:'https://i.pinimg.com/474x/f6/23/07/f623079bcc02b49ab9a839b239c81b9d.jpg',categoryId:movies.id })
        const westSideStory = await createProduct({ title:'West Side Story', description:'A rivalry between ethnic backgrounds *Eyeroll* ', price:10.00,quantity:10, imageUrl:'https://i.pinimg.com/564x/83/b2/a0/83b2a0298f4a5c18278aefa9a440ae43.jpg',categoryId:movies.id})
        const littleWomen = await createProduct({ title:'Little Women',description:'4 sisters',price:25.00,quantity:20, imageUrl:'https://i.pinimg.com/564x/a1/ae/90/a1ae90417b7e8a037ad20b16392ce17e.jpg',categoryId:movies.id})
        const ladyOnFire = await createProduct({ title: 'Portrait of a Lady On Fire', description:' ouch',price:20.00,quantity:10, imageUrl: 'https://cdn.shopify.com/s/files/1/0275/8351/2681/products/PLF_AkikoPoster_2000x@2x.progressive.jpg?v=1654199751',categoryId:movies.id})
        const blackSwan =await createProduct({title:'Black Swan',description:'A confusing movie dont watch when a toddler', price:20.00,quantity:10,imageUrl:'https://i.pinimg.com/564x/ce/0c/ff/ce0cff6131d1c7946aa514f7b6748fa2.jpg',imageAlt:"an image of the poster for black swan" ,categoryId:movies.id})
        const hereditary =await createProduct({ title:'Hereditary',description:'A WTF kind of movie', price:15.00, quantity:10, imageUrl:'https://i.pinimg.com/564x/89/a6/e0/89a6e080474623cf3bfce05163fac57b.jpg',categoryId:movies.id})
        const midSommar =await createProduct({ title:'Midsommar',description:'Culty',price:20.00,quantity:15,imageUrl:'https://i.pinimg.com/564x/bb/ab/1c/bbab1ca03a8b81457c02133c4f0a365d.jpg',categoryId:movies.id})
        const everythingEverywhere = await createProduct({ title: 'Everything Everywhere All At Once', description:'crazy', price:20.00, quantity:15, imageUrl:'https://i.pinimg.com/564x/43/4d/be/434dbe2df3ad3afeccb0011659e978bf.jpg',categoryId:movies.id})
        const spiderMan = await createProduct({ title:'Spiderman Into The Spiderverse', description:' Miles Morales', price:20.00,quantity:15, imageUrl:'https://i.pinimg.com/564x/c4/b0/b3/c4b0b31635fb0c935271c979f2d3bcf7.jpg',categoryId:movies.id})
        const wolfOfWalls=await createProduct({ title: 'Wolf Of Wallstreet',description:'self explanatory', price:20.00,quantity:10, imageUrl:'https://i5.walmartimages.com/asr/7eb0cdc8-47a7-406d-ac83-59db69071a17_1.7fc5796fe564d76ad9af069d6cce4a41.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',categoryId:movies.id})
        const barbarian =await createProduct({ title:'Barbarian', description:'Airbnb nightmare', price:25.00, quantity:15, imageUrl:'https://i0.wp.com/bloody-disgusting.com/wp-content/uploads/2022/09/barbarian-art.jpg?ssl=1',categoryId:movies.id})
        const bleachers =await createProduct({ title:' The Bleachers',description:'Band',price:20.00,quantity:20,imageUrl:'https://i.pinimg.com/564x/04/a0/9c/04a09c7b371408dfb0d617f7a97110cf.jpg',categoryId:music.id})
        const arcticMonkeys=await createProduct({title:'Arctic Monkey',description:'Band', price:20.00,quantity:12, imageUrl:'https://i.pinimg.com/564x/22/61/59/226159347177904e4de8779f3c097b7b.jpg',categoryId:music.id})
        const szaa=await createProduct({title:'sza', description:'Artist',price:25.00, quantity:10, imageUrl:'https://i.pinimg.com/474x/18/fd/2c/18fd2c38f5cf7d4e124a7c7792e99c41.jpg ',categoryId:music.id})
        const theWeeknd =await createProduct({title:'The Weeknd', description:'sad- mf',price:25.00,quantity:23, imageUrl:'https://i.pinimg.com/564x/bf/62/bb/bf62bb91015676488c5adda1251d997d.jpg',categoryId:music.id})
        const theBookThief = await createProduct({title:'The Book Theif',description:'Leisel,Germany ww2',price:3009,quantity:2013,imageUrl:"https://i.pinimg.com/564x/65/2f/9a/652f9a7c4e9eaa7a0817bf3acd3d3ee2.jpg",categoryId:movies.id})
        const saveYourselves =await createProduct({title:'Save Yourselves',description:'SAVE YOURSLEF!',price:23.00,quantity:2001,imageUrl:"https://images.squarespace-cdn.com/content/v1/582b5029bebafb10ec217bdf/1615830666374-4U5SQRFJMU12E8F5HCQ4/SaveYourselves_rgb.jpg?format=1500w",categoryId:movies.id})
        const tampopop = await createProduct({title:'Tampopo',description:'TAMPOPOPOPOOPOP',price:20.00,quantity:5,imageUrl:"https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Tampopo_-_Poster.jpg/220px-Tampopo_-_Poster.jpg",categoryId:movies.id})
        const fmf = await createProduct({title:'Fantastic Mr.Fox',description:'A FOX?????',price:32.00,quantity:324, imageUrl:"https://www.tvguide.com/a/img/catalog/provider/1/2/1-4493722784.jpg",categoryId:movies.id})
        const dtrt = await createProduct({title:'Do The Right Thing',description:'WHATS THE WRONG THING',price:23.00,quantitiy:90,imageUrl:"https://product-image.juniqe-production.juniqe.com/media/catalog/product/seo-cache/x800/133/25/133-25-101P/Do-The-Right-Thing-Bruno-Morphet-Poster.jpg",categoryId:movies.id})
        const waves = await createProduct({title:'Waves',description:'BEACH BEACH ', price:25.00, quantity:454,imageUrl:"https://i.etsystatic.com/18242346/r/il/f89d0a/2130906157/il_1588xN.2130906157_qrxe.jpg",categoryId:movies.id})
        const stby = await createProduct({title:'Sorry To Bother You',description:'BOTHER ME PLEASEEEE',price:23.00,quantity:234,imageUrl:"https://m.media-amazon.com/images/M/MV5BNjgwMmI4YzUtZGI2Mi00M2MwLWIyMmMtZWYzMWZmNzAyNmYwXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",categoryId:movies.id})
        const dmfm = await createProduct ({title:'Dial M for Murder',description:'M.',price:45.00,quantitiy:243,imageUrl:"https://i.ytimg.com/vi/Jl9rsKq1BTQ/movieposter_en.jpg",categoryId:movies.id})
        const logan = await createProduct({title:'Logan',description:'LOGAN WOLVERINE AGGRESSIVE FOR NO REASON SOMETIMES!,GETTING OLD', price:45.00,quantity:564,imageUrl:"https://upload.wikimedia.org/wikipedia/en/3/37/Logan_2017_poster.jpg",categoryId:movies.id})
        const tng = await createProduct({title:'The Nice Guys', description:'THEYREEEE NOICEEEE GUYSSSSSS!',price:23.00,quantity:23,imageUrl:"https://m.media-amazon.com/images/M/MV5BODNlNmU4MGItMzQwZi00NGQyLWEyZWItYjFkNmI0NWI4NjBhXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",categoryId:movies.id})
        const ttb = await createProduct({title:'Train to busan',description:'ZOOMMMM---BIEEEEEE TRAINNNN !',price:90.00,quantity:890,imageUrl:"https://flxt.tmsimg.com/assets/p13070850_p_v8_ay.jpg",categoryId:movies.id})
        // const  tylertc = await createProduct({title:'Tyler the Creater Album',description:'Call Me if You Get Lost',price:89.00,quantity:23,imageUrl:"https://files.slack.com/files-pri/T024FPYBQ-F04D57901UP/image.png"})
        // const  tyler = createProduct({title:'Earfquake',description:'Dont Leave its My Fault',price:67.00, quantity:23,imageUrl:"https://files.slack.com/files-pri/T024FPYBQ-F04DKP72ENN/image.png"})
        // const theInternet= createProduct({title:'Ego Death',description:'Album Poster',price:85.00,quantity:34,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04DD5W3C6S/image.png'})
        // const boJackhm= createProduct({title:'Bojack HorseMan',description:'lol',price:90.00,quantity:12,imageUrl:'https://files.slack.com/files-tmb/T024FPYBQ-F04DKPJ1RKL-c6fd0160ec/image_720.png'})
        // const childish =createProduct({title:'Childish Gambino',description:'Donald Glover',price:80.00,quantity:900,imageUrl:'https://files.slack.com/files-tmb/T024FPYBQ-F04D57N24LF-961087ed4b/image_720.png'})
        // const kurtVille=createProduct({title:'Kurt Vile and the Violators',description:'American singer, songwriter, multi-instrumentalist, and record producer. He is known for his solo work and as the former lead guitarist of rock band the War on Drugs.',price:89.00,quantity:90,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04DN7SQUGL/image.png'})
        // const khruangbin= createProduct({title:'Khruangbin',description:'Trio from Houston, Texas',price:56.00,quantity:89,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04DGRCK5RT/image.png'})
        // const silksonic= createProduct({title:'Silk Sonic',description:'Bruno Mars and Anderson Pakk.',price:32.00,quantity:50,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04DKM387M1/image.png'})
        // const ariana= createProduct({title:'Ariana Grande',description:'.',price:52.00,quantity:30,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04E9FHKEHW/image.png'})
        // const goat =createProduct({title:'GOAT',description:'Mac Miller in Album Swimming RIP',price:1000000,quantity:90,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04D58D1QNB/image.png'})
        // const riri =createProduct({title:'Rihanna',description:'riririirr',price:70.00,quantity:12,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04E9FT2VCY/image.png'})
        // const frankOcean = createProduct({title:'Frank Ocean',title:'Blond',price:30.00,quantity:56,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04E9FT2VCY/image.png'})
        // const father = createProduct({title:'Father John Misty',description:'Fear Fun',price:67.00,quantity:76,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04DKQNE6PL/image.png'})
        // const hg = createProduct({title:'Hermanos Gutierrez',description:'REALISMO MAGICO TOUR',price:23.00,quantity:90,imageUrl:'https://files.slack.com/files-tmb/T024FPYBQ-F04DKQYND50-0251fe0bbf/image_720.png'})
        // const durand = createProduct({title:'The Indications',description:'U.S TOUR 2020',price:12.00,quantity:90,imageUrl:'https://files.slack.com/files-pri/T024FPYBQ-F04DD7LH04W/image.png'})
        // const nina = createProduct({title:'Nina Samone',description:'The AMAAZING NINA SAMONE',price:78.00,quantity:56,imageUrl:'https://files.slack.com/files-tmb/T024FPYBQ-F04DKN70H8T-bb1ceda193/image_720.png'})
        console.log(scottPilgrim,akira,theOutsiders,theSilenceOfLambs,alienET,westSideStory,littleWomen,ladyOnFire,blackSwan)


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
        // const shakiraCart = await   createCart({userId:1,isActive:false,totalPrice:0})
        // const cantinflasCart = await createCart({userId:2,isActive:true,totalPrice:0})
        // const ke$haCart = await createCart({userId:3,isActive:true,totalPrice:0})
        // const ianCart = await createCart({userId:4, isActive:true, totalPrice:0});
        // const ianCart2 = await createCart({userId:4, isActive:false, totalPrice:0});
        // const yeisi= await createCart ({userId:7,isActive:true,totalPrice:0});
        // const madi =await createCart({userId:5,isActive:true,totalPrice:0});
        // const jennaA=await createCart({userId:6,isActive:true,totalPrice:0});

        // const shrekS = await createCart({userId:7,isActive:true,totalPrice:0})
        // const fionaFFA = await createCart({userId:8, isActive:true,totalPrice:0})
        // const jefferyD = await createCart({userId:9,isActive:true, totalPrice:0})
        // const katyP = await createCart({ userId:10,isActive:true,totalPrice:0})
        // const donkayyy = await createCart({userId:11, isActive:true,totalPrice:0})
        // const madonna = await createCart({userId:12, isActive:true,totalPrice:0})
        // const gwenS =await createCart({userId:13,isActive:true,totalPrice:0})
        // const cheapSkate= await createCart({userId:14,isActive:true,totalPrice:0})
        // const canadian = await createCart({userId:16,isActive:true,totalPrice:0})
        // const ettt = await createCart({userId:17,isActive:true,totalPrice:0})

    } catch(error){
        console.log(error);
    }
}

async function createInitialCartDetails() {
    const IansCartDetailsOne =await addItemToCartDetails({cartId:14, productId:2, quantity:2})
    const IansCartDetailsTwo =await addItemToCartDetails({cartId:14,productId:20,quantity:1})
    const donkayyyCartDetailsOne =await addItemToCartDetails({cartId:16,productId:15, quantity:5})
    const shrekCartDetails = await addItemToCartDetails({cartId:17,productId:9,quantity:7})
    const donkayyyCartDetailstwo =await addItemToCartDetails({cartId:18,productId:15,quantity:90})
    const princeCharming =await addItemToCartDetails({cartId:18,productId:5,quantity:7})
    const fairyGodMom =await addItemToCartDetails({ cartId:18,productId:12,quantity:10})
}


async function createInitialReviews(){
    console.log("creating initial reviews...")
    try{
        const itCameInRipped = await createReview({userId:1,productId:2,title:"It came in ripped",description:"My poster must've been delivered by a crazy dude, because it came in the mail ripped, but the company was willing to replace it for free! Thanks poster-children!"})
        const highQuality = await createReview({userId:2,productId:3,title:"Very Shiny high quality",description:"My poster was glittering and bright! I love it!"})
        const cheapAndGood = await createReview({userId:3,productId:1,title:"Hung it up right away..!", description:"I had to go buy a poster frame for this amazing poster right away and hung it up in my living room!" })
        const trueToSize = await createReview({user:4,productId:4,title:"True to size!",description:"I thought it would be smaller but was super true to size!!!"})
        const notAScam = await createReview({user:5,productId:5,title:"SOOO NOT SCAM !",description:"Was super surprised it was not a scam"})
        const yyehaaaww =await createReview({ user:11, productId:6,title:"*western accent*" ,description:"I loveddd the way my yeehaw poster looked with my cow print wall"})
        const buildingOnFire = await createReview({userId:8,productId:7,title:"FIREEE",description:"My complex was on fire but I HAD to run back for my poster!"})
        const myKid = await createReview({userId:9,productId:8,title: "sad kids",description :" my kids cried because the poster was ugly"})
        const jail =await createReview({ userId:10,productId:9,title:"Gwen stefani",description:"🤌🏼 so good"})
        const et = await createReview({userId:17,productId:10,title:"E.TTTT",description:"Couldve picked a better poster"})
        const comoSeDice = await createReview({userId:12,productId:11,title:"Como se dice", description:"estas cosas son del diablio"})
        const dog = await createReview({userId:13, productId:12,title:"My dog 8 it ", description:"its not dog proof"})
        const mymom = await createReview({userId:14,productId:12, title:"my mom", description:"my mom says its to expensif for what im getting"})
        const heh = await createReview({userId:15,productId:13,title:"ew",description:"smelled like plastic"})
        const aye = await createReview({userId:16,productId:14,title:" Canada", description:"shipped all the way to canada aye"})
        const sucks = await createReview({userId:7,productId:15,title:"EHH",description:"Was super MID gave it to my mom to clean the floor"})
    }catch(error){
        console.log(error);
    }
}

async function createInitialCreditCards(){
    console.log("creating credit cards...")
        try{
            const shakiraVault = await addCreditCard({creditNumber:3423234223422342, CVV:333, expiration:1194, name:"Shakira's Name", zipcode:90555, userId:1});
            console.log("success creating credit cards!")
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
        // await getCartDetailsByCart(4);
        // await removeItemFromCartDetails(2);
        // await addQuantityToCart(4,2,3);
        // await deleteCart(8);
        // await totalPricer(4);
        // await getActiveCartByUserId(18)
        // await purchaseCart(18,18)
}

async function rebuildDB(){
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialAddress();
    await createInitialCategories();
    await createInitialProducts();
    await createInitialCart();
    await createInitialReviews();
    await createInitialCartDetails();
    // await createInitialCreditCards();
    await testDB();
    client.end();
}

rebuildDB();