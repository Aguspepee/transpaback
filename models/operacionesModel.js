const mongoose = require("../bin/mongodb")

//creación schema
const operacionesSchema = mongoose.Schema({
    IDNOV:{
        type: Number,
        default: null
    },
    IDEQ: {
        type: String,
        default: ""
    },
    NOMB: {
        type: String,
        default: ""
    },
    INT: {
        type: Number,
        default: null
    },
    FSAL: {
        type: Date,
        default: null
    },
    HSAL: {
        type: Number,
        default: null
    },
    MSAL: {
        type: Number,
        default: null
    },
    FENT: {
        type: Date,
        default: null
    },
    HENT: {
        type: Number,
        default: null
    },
    MENT: {
        type: Number,
        default: null
    },
    ENS: {
        type: String,
        default: "-"
    },
    PREDU: {
        type: String,
        default: "-"
    },
    OBSERVACIONES: {
        type: String,
        default: null
    },
    FINF: {
        type: Date,
        default: null
    },
    HINF: {
        type: String,
        default: ""
    },
    MINF: {
        type: String,
        default: ""
    },
})

//creación model
module.exports = mongoose.model("operaciones", operacionesSchema)