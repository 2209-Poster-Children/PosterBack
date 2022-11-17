function requireUser(req,res, next){
    console.log("This is req user",req.user)
    if(!req.user){
        next({
            name: "MissingUserError",
            message: "You MUST be loggied in to perform this action"
        });
    }
    next();
}

module.exports ={
    requireUser
}