const mongoose = require("../bin/mongodb")

//creación schema
const equiposSchema = mongoose.Schema({
    ubicación_tecnica_sap:{
        type: String,
        default: ""
    },
    ID: {
        type: String,
        //unique: true
    },
    denominacion: {
        type: String,
        default: ""
    },
    status_sistema: {
        type: String,
        default: ""
    },
    zona: {
        type: String,
        default: ""
    },
    campo_clasificacion: {
        type: String,
        default: ""
    },
    pto_tbjo_resp: {
        type: String,
        default: ""
    },
    grupo_planif: {
        type: String,
        default: ""
    },
    creado_el: {
        type: Date,
        default: null
    },
    fecha_adquis: {
        type: String,
        default: ""
    },
    fabricante: {
        type: String,
        default: ""
    },
    denomin_tipo: {
        type: String,
        default: ""
    },
    n_pieza_fabric: {
        type: String,
        default: ""
    },
    fabr_n_serie: {
        type: String,
        default: ""
    },
    centro_coste: {
        type: String,
        default: ""
    },
    elemento_pep: {
        type: String,
        default: ""
    },
    emplazamiento: {
        type: String,
        default: ""
    }
})

//creación model
module.exports = mongoose.model("equipo", equiposSchema, 'equipos')