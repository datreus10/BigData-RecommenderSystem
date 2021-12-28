
const jwt = require('jsonwebtoken');
var User= require('../models/user')
const verifytoken = async function (req,res,next){
    try{
        var token = req.cookies.token
        if(!token){
            req.user=''
            next()
        }
        else{
            var verify = jwt.verify(token,'signature')
            var user = await User.findById(verify._id)
            if(verify){
                req.user= user
                next()
            }
        } 
    }
    catch(err){
        res.redirect('/logout')
        console.log(err)
    }
}
const accessToken = async function(req,res,next){
    Email = req.body.Email
    Password = req.body.Password
    try{
           
            var user = await User.find({Email:Email,Password:Password})
            if(user.length == 0){
                //req.flash('error',"Đăng nhập không thành công")
                return res.redirect('/login')
            }else{
                req.userId = user._id
                token= jwt.sign({_id:user._id},'signature',{expiresIn:'4h'})
                res.cookie("token", token);
                next()
            }
    }catch(err){
        console.log(err)
        //req.flash('error',"Đăng nhập không thành công")
        return res.redirect('/login')
    }
   
}
module.exports={
    verifytoken,
    accessToken,
}