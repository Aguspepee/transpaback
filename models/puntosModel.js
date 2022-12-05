const mongoose = require("../bin/mongodb")

//creación schema
const puntosSchema = mongoose.Schema({
    codigo: {
        type: String,
        default: ""
    },
    descripcion: {
        type: String,
        default: ""
    },
    numero: {
        type: String,
        default: ""
    },
    remunera: {
        type: String,
        default: ""
    },
    alta: {
        type: Date,
        default: null
    },
    baja: {
        type: Date,
        default: null
    },
    ta: {
        type: Number,
        default: null
    },
    tension: {
        type: Number,
        default: null
    },
    BDE: {
        type: Number,
        default: null
    },
    IDEQ: {
        type: String,
        default: ""
    },
    propietario: {
        type: String,
        default: ""
    },
    usuario: {
        type: String,
        default: ""
    },
})

//creación model
module.exports = mongoose.model("puntos", puntosSchema)