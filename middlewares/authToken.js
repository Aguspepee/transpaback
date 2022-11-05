//Token Validation
const jwt = require("jsonwebtoken")
const CONFIG = require("../config/config")

module.exports = function validateToken(req, res, next) {
     if(req.path != "/users/login"){
        if(req.headers.authorization){
            let token = req.headers.authorization.split(" ")[1]
             jwt.verify(token,CONFIG.SECRET_KEY,function(error,decoded){
                if(error){
                 // console.log("el token no era válido")
                  res.status(500).send({message:error.message})
                  
                }else{
                 // console.log("lo decodificó",decoded)
                  next()
                }
              }) 
        }else{
            //La petición es válida, pero si no tiene header, no va a acceder
            res.status(403).send({message:"No tiene los permisos suficientes para acceder"})
        }
    }else{
        next()
    } 
  };

