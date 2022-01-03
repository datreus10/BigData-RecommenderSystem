var mongoose = require ('mongoose')

var UserSchema = new mongoose.Schema({
   id: Number,
   Name: String,
   Email: String,
   Password: String,  
})

 module.exports = mongoose.model('User',UserSchema) 
     