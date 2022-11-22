const express = require ('express')
require ('dotenv').config()
const morgan=require ('morgan');

const app= express();
app.use(express.urlencoded ({extended:false}));
app.use(morgan('dev'));
app.use(express.json());

const apiRouter=require ('./api')
app.use ('/api',apiRouter)

const {client}=require('./db')

client.connect()
app.listen(3000,()=>{
    console.log('we are up and running on port 3000')
})
