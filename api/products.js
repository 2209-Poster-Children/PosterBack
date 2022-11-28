const express= require('express')
const {getAllProducts, getProductByTitle,
    createProduct, getProductById, updateProduct } = require ('../db/products')
const productsRouter = express.Router();
const {requireUser} = require('./utils');
const {requireAdmin} = require('./utilsadmin')



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

productsRouter.get('/:id',async(req,res,next)=>{
    try{
        const {id} = req.params;
        const product = await getProductById(id)
        res.send(product)
    }catch(error){
        console.log(error);
    }
})
//GET products/title
productsRouter.get('/title/:title',async(req,res,next)=>{
    try{
        const {title} = req.params;
        console.log(title)
        const product = await getProductByTitle(title)
        res.send(product)
    }catch(error){
        console.log(error)
    }
})




productsRouter.patch('/',requireUser,requireAdmin,async (req,res,next)=>{
    try{
        const {id,fields}=req.body;
        const updatedProduct= await updateProduct(id,fields)
        res.send (updatedProduct)
        
    }catch(error){
        console.log(error)
    }
})

module.exports = productsRouter;