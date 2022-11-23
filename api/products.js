const express= require('express')
const {getAllProducts, getProductByTitle,
    createProduct, getProductById} = require ('../db/products')
const productsRouter = express.Router();

productsRouter.get('/',async (req,res,next)=>{
    try{
        const allProducts = await getAllProducts()
        
        res.send(allProducts);
        
    }catch(error){
        console.log(error)
    }
})



module.exports = productsRouter;