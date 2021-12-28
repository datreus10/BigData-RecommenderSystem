var express =  require('express')
var User = require("../models/user");
var router = express.Router()
router.get('/',(req,res) => {
    res.render('signin');
}) 
router.post('/',async (req,res)=>{
    try{
        var body = req.body;
        var user = new User({
            Name: body.Name,
            Email: body.Email,
            Password: body.Password
        })
       
       if(usertmp){
        res.redirect('/signin')
       } 
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
   
})
module.exports = router;