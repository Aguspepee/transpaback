const mongoose = require("../bin/mongodb")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//creación schema
const indisponibilidadesSchema = mongoose.Schema({
    Ta: {
        type: String,
        default: ""
    },
    Codi: {
        type: String,
        default: ""
    },
    NOMBRE: {
        type: String,
        default: ""
    },
    SALIDA: {
        type: Date,
        default: null
    },
    Durac: {
        type: Number,
        default: null
    },
    Cl: {
        type: Number,
        default: null
    },
    OBSERVACIONES: {
        type: String,
        default: ""
    },
    Elem: {
        type: String,
        default: ""
    },
    ENTRADA: {
        type: Date,
        default: null
    },
    Datos: {
        type: String,
        default: ""
    },
    ENS: {
        type: String,
        default: ""
    },
    ENS_value: {
        type: Number,
        default: function () { return (+(this.ENS)) }
    },
    Causa: {
        type: String,
        default: ""
    },
    Pot: {
        type: Number,
        default: null
    },
    Energ: {
        type: Number,
        default: null
    },
    Sancion: {
        type: Number,
        default: null
    },
    mas: {
        type: String,
        default: ""
    },
    IDEQ: {
        type: String,
        default: ""
    },
})

indisponibilidadesSchema.plugin(aggregatePaginate);
//creación model
module.exports = mongoose.model("indisponibilidades", indisponibilidadesSchema)