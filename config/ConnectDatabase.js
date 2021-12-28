const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect('mongodb+srv://quanghuy:quanghuy1208@cluster0.isa3x.mongodb.net/MovieRecommendation?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`MongoDb connected with host: ${con.connection.host}`);
    })
    .catch((err)=>console.log(err.msg))
};

module.exports = connectDatabase;
