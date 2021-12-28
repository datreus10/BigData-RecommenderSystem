var express =  require('express')
var User = require("../models/user");
var router = express.Router()
const { accessToken } = require("../middleware/auth");
router.get('/',(req,res) => {
    res.render('signin');
}) 
router.post('/',accessToken,async (req,res)=>{
        res.redirect('/')
})
module.exports = router;