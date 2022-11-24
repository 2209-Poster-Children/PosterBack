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

function requireAdmin(req,res,next){
    console.log("Test your might")
    if(req.user.admin !== true){
        res.status()
        next({
            name: "You SHALL NOT PASS",
            message: "THIS IS NOT FOR YOU MINION"
        })
    }
    next();
}
// require admin

module.exports ={
    requireUser
}