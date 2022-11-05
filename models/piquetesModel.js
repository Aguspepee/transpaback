const mongoose = require("../bin/mongodb")

//creación schema
const piquetesSchema = mongoose.Schema({
    equipo: {
        type: String,
        default: "hola"
    },
    denominacion: {
        type: String,
        default: "hola"
    },

})

//creación model
module.exports = mongoose.model("piquetes", piquetesSchema)