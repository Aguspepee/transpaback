const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
console.log(process.env.MONGODB_URI)
mongoose.connect(
  //"mongodb://0.0.0.0:27017/transpa",
  //process.env.MONGODB_URI,
  "mongodb+srv://aguspepee1:K9IS28ZkOHRZjt0d@cluster0.jb7eohq.mongodb.net/transpa?retryWrites=true&w=majority",
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
