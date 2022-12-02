const express = require ('express')
require ('dotenv').config()
const morgan=require ('morgan');
const cors = require("cors")
const app= express();
app.use(cors());
app.options("*",cors())
app.use(express.urlencoded ({extended:false}));
app.use(morgan('dev'));
app.use(express.json());


const apiRouter=require ('./api')
app.use ('/api',apiRouter)


const {client}=require('./db')

client.connect()
app.listen(3001,()=>{
    console.log('we are up and running on port 3001')
})
