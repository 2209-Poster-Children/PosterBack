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


module.exports ={
    requireUser
}