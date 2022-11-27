const express= require('express')
const {getAllProducts, getProductByTitle,
    createProduct, getProductById} = require ('../db/products')
const {requireUser} = require('./utils');
const {requireAdmin} = require('./utilsadmin')
const productsRouter = express.Router();


productsRouter.get('/',async (req,res,next)=>{
    try{
        const allProducts = await getAllProducts()
        
        res.send(allProducts);
        
    }catch(error){
        console.log(error)
    }
})

productsRouter.post('/',requireUser, requireAdmin,async(req,res,next)=>{
    try{
        console.log("hello")
        console.log(req.body)
        const {title,description,price,quantity,imageUrl} = req.body;
        const newProduct = await createProduct({title, description, price, quantity, imageUrl});
        res.send({message:"new product created", product:newProduct})
    }catch(error){
        console.log(error)
    }
})

//GET products/title
productsRouter.get('/title',async(req,res,next)=>{
    try{
        const {title} = req.body;
        console.log(title)
        const product = await getProductByTitle(title)
        res.send(product)
    }catch(error){
        console.log(error)
    }
})

module.exports = productsRouter;