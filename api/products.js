const express= require('express')
const {getAllProducts, getProductByTitle,
    createProduct, getProductById, updateProduct, deleteProduct } = require ('../db/products')
const productsRouter = express.Router();
const {requireUser} = require('./utils');
const {requireAdmin} = require('./utilsadmin')

// GET /api/products
productsRouter.get('/',async (req,res,next)=>{
    try{
        const allProducts = await getAllProducts()
        res.send(allProducts);
        
    }catch ( { name, message } ) {
        next({ name, message })
    }
})

// POST /api/products requires user, admin, title, description, price, quantity, imageUrl, (imageAlt(haven't done this yet))
productsRouter.post('/',requireUser, requireAdmin,async(req,res,next)=>{
    try{
        // console.log(req.body)
        const {title,description,price,quantity,imageUrl} = req.body;
        const newProduct = await createProduct({title, description, price, quantity, imageUrl});
        res.send({message:"new product created", product:newProduct})
    }catch ( { name, message } ) {
        next({ name, message })
    }
})

// GET /api/products/:id
productsRouter.get('/:id',async(req,res,next)=>{
    try{
        const {id} = req.params;
        const product = await getProductById(id)
        res.send(product)
    }catch ( { name, message } ) {
        next({ name, message })
    }
})

// GET products/title/:title 
productsRouter.get('/title/:title',async(req,res,next)=>{
    try{
        const {title} = req.params;
        console.log(title)
        const product = await getProductByTitle(title)
        res.send(product)
    }catch ( { name, message } ) {
        next({ name, message })
    }
})

// PATCH products/title (requires user, admin), id, fields for the body
productsRouter.patch('/',requireUser,requireAdmin,async (req,res,next)=>{
    try{
        const {id,fields}=req.body;
        const updatedProduct= await updateProduct(id,fields)
        res.send (updatedProduct)
        
    }catch ( { name, message } ) {
        next({ name, message })
    }
})

// likely this function will need to also delete all cart iterations of the product
productsRouter.delete('/',requireUser,requireAdmin,async(req,res,next)=>{
    try{
        const {id} = req.body;
        const deletedProduct = await deleteProduct(id)

        res.send(deletedProduct);
    }catch({name,message}){
        next({name, message})
    }
})

// need to write a delete router for products
module.exports = productsRouter;