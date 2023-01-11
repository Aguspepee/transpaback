const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect(
  "mongodb://0.0.0.0:27017/transpa",  //PRODUCCIÓN
  //process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  }, function (error){
      if(error){
          throw error;
      }else{
          console.log("Conectado a MongoDB" + process.env.MONGODB_URI)
      }
  }
);

module.exports = mongoose
