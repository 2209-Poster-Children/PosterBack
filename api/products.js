const express= require('express')
const {getAllProducts, getProductByTitle,
    createProduct, getProductById} = require ('../db/products')
const productsRouter = express.Router();

module.exports = productsRouter;