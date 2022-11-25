const {checkUserAdminStatus} = require('../db/users');

async function requireAdmin(req,res,next){
    const username = req.user.username
    const admin = await checkUserAdminStatus(username)
    if(admin !== true){
        res.status()
        next({
            name: "You SHALL NOT PASS",
            message: "THIS IS NOT FOR YOU MINION"
        })
    }
    next()
}

module.exports ={
    requireAdmin
}
