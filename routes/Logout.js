var express= require('express')
var router = express.Router()

router.get('/',function(req,res,next){
    try {
        res.clearCookie("token");
        // res.clearCookie("user");
        res.redirect('/');
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
})
module.exports = router