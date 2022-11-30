const express=require('express');
const apiRouter=express.Router()
require ('dotenv').config();

const { getUserById } = require('../db/users');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// set 'req.user' if possible
// USE /api/
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    
    if (!auth) { // nothing to see here
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const parsedToken = jwt.verify(token, JWT_SECRET);
            
            const id = parsedToken && parsedToken.id
            if (id) {
                req.user = await getUserById(id);
                console.log("req.user set!", req.user);
                next();
            }
        } catch (error) {
            next(error);
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
        }
});

apiRouter.use('/',async(req,res,next)=>{
    console.log("api routers up");
    next()
});


const usersRouter=require('./users')
apiRouter.use('/users',usersRouter)
const productsRouter = require('./products')
apiRouter.use('/products',productsRouter)
const reviewsRouter = require('./reviews')
apiRouter.use('/reviews',reviewsRouter)
const addressRouter = require('./address')
apiRouter.use('/address',addressRouter );
const cartRouter = require('./cart');
apiRouter.use('/cart',cartRouter);

// Error handling
apiRouter.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    });
});

module.exports=apiRouter;