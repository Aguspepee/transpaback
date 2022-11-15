const mongoose = require("../bin/mongodb")

//creación schema
const operacionesSchema = mongoose.Schema({
    Ta:{
        type: String,
        default: ""
    },
    codigo: {
        type: String,
        default: ""
    },
    nombre: {
        type: String,
        default: ""
    },
    SALIDA: {
        type: Date,
        default: null
    },
    durac: {
        type: Number,
        default: 0
    },
    Cl: {
        type: String,
        default: ""
    },
    observaciones: {
        type: String,
        default: ""
    },
    elem: {
        type: String,
        default: ""
    },
    ENTRADA: {
        type: Date,
        default: null
    },
    datos_adicionales: {
        type: String,
        default: ""
    },
    ens: {
        type: String,
        default: ""
    },
    causa: {
        type: String,
        default: ""
    },
    potencia: {
        type: String,
        default: ""
    },
    sancion: {
        type: String,
        default: ""
    },
    mas: {
        type: String,
        default: ""
    },
    IDEQ: {
        type: String,
        default: ""
    }
})

//creación model
module.exports = mongoose.model("operaciones", operacionesSchema)