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
        numUser = await User.find();
        console.log(numUser);
        if(checkUser.length > 0){
            res.redirect('/signup')
        }else{
            var user = new User({
                id: numUser.length +1000000,
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