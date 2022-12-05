const mongoose = require("../bin/mongodb")

//creación schema
const lineasSchema = mongoose.Schema({
    codigo: {
        type: String,
        default: ""
    },
    tension: {
        type: Number,
        default: null
    },
    denominacion: {
        type: String,
        default: ""
    },
    notas: {
        type: String,
        default: ""
    },
    longitud_oficial: {
        type: Number,
        default: null
    },
    longitud_planim: {
        type: Number,
        default: null
    },
    longitud_diferencia: {
        type: Number,
        default: null
    },
    ano_p_servicio: {
        type: Number,
        default: null
    },
    seccion: {
        type: String,
        default: ""
    },
    hg: {
        type: String,
        default: ""
    },
    material: {
        type: String,
        default: ""
    },
    tipo_de_estructura: {
        type: String,
        default: ""
    },
    compartida: {
        type: String,
        default: ""
    },
    torres_cantidad: {
        type: Number,
        default: null
    },
    suspension_cantidad: {
        type: Number,
        default: null
    },
    suspension_aisl: {
        type: Number,
        default: null
    },
    suspension_masa: {
        type: Number,
        default: null
    },
    retencion_cant: {
        type: Number,
        default: null
    },
    retencion_asil: {
        type: Number,
        default: null
    },
    retencion_masa: {
        type: Number,
        default: null
    },
    altura_cond: {
        type: Number,
        default: null
    },
    ta: {
        type: Number,
        default: null
    },
    zona: {
        type: Number,
        default: null
    },
    servidumbre_urbana: {
        type: Number,
        default: null
    },
    servidumbre_rural: {
        type: Number,
        default: null
    },
    sale: {
        type: String,
        default: ""
    },
    llega: {
        type: String,
        default: ""
    },
    BDE: {
        type: Number,
        default: null
    },
    IDEQ: {
        type: String,
        default: ""
    },
    observaciones: {
        type: String,
        default: ""
    },
    resistividad_terreno: {
        type: Number,
        default: null
    },
    pot_nat: {
        type: Number,
        default: null
    },
    impedancia_caracteristica: {
        type: Number,
        default: null
    },
    constante_atenuacion: {
        type: Number,
        default: null
    },
    constante_fase: {
        type: Number,
        default: null
    },
    velocidad_propagacion: {
        type: Number,
        default: null
    },
    R: {
        type: Number,
        default: null
    },
    X: {
        type: Number,
        default: null
    },
    B: {
        type: Number,
        default: null
    },
    R0: {
        type: Number,
        default: null
    },
    X0: {
        type: Number,
        default: null
    },
    B0: {
        type: Number,
        default: null
    },
    limite_termico: {
        type: Number,
        default: null
    },
    propietario_1: {
        type: String,
        default: ""
    },
    propietario_2: {
        type: String,
        default: ""
    },
    denominacion_operaciones: {
        type: String,
        default: ""
    },
    fecha_inicio: {
        type: Date,
        default: null
    },
    fecha_fin: {
        type: Date,
        default: null
    },
})

//creación model
module.exports = mongoose.model("lineas", lineasSchema)