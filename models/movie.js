var mongoose = require ('mongoose')

var MovieSchema = new mongoose.Schema({
   userId: Number,
   movieId: Number,
   tmdbId: Number,
})

 module.exports = mongoose.model('Movie',MovieSchema) 