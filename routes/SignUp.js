var express =  require('express')
var User = require("../models/user");
var router = express.Router()
router.get('/',(req,res) => {
    res.render('signup');
}) 
router.post('/',async (req,res)=>{
    try{
        var body = req.body;
        checkUser = await User.find({Email: body.Email})
        if(checkUser.length > 0){
            res.redirect('/signup')
        }else{
            var user = new User({
                Name: body.Name,
                Email: body.Email,
                Password: body.Password
            })
           usertmp = await user.save()
           if(usertmp){
            res.redirect('/signin')
           } 
        }
      
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
   
})
module.exports = router;