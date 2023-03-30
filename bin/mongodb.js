const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI,  
  {
    useNewUrlParser: true,
  }, function (error){
      if(error){
          throw error;
      }else{
          console.log("Conectado a MongoDB " + process.env.MONGODB_URI)
      }
  }
);

module.exports = mongoose
