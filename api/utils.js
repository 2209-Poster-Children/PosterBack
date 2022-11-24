const {checkUserAdminStatus} = require('../db/users');


function requireUser(req,res, next){
    console.log("This is req user",req.user)
    if(!req.user){
        res.status(403)
        next({
            name: "MissingUserError",
            message: "You MUST be loggied in to perform this action"
        });
    }
    next();
}
//unfinished
async function requireAdmin(req,res,next){
    console.log("Test your might")
    console.log("here's my user" ,req.user);
    const username = req.user.username
    const admin = checkUserAdminStatus(username)
    if(admin !== true){
        res.status()
        next({
            name: "You SHALL NOT PASS",
            message: "THIS IS NOT FOR YOU MINION"
        })
    }
    next()
}
// require admin

module.exports ={
    requireUser,requireAdmin
}