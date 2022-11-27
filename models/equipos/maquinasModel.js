const mongoose = require("../../bin/mongodb")

//creación schema
const maquinasSchema = mongoose.Schema({
    /*     ubicación_tecnica_sap:{
            type: String,
            default: ""
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
        } */
    ID: {
        type: String,
        unique: true
    },
    equipo: {
        type: String,
        default: "maquinas"
    },
    ubicacion_tecnica: {
        type: String,
        default: ""
    },
    descripcion: {
        type: String,
        default: ""
    },
    sub_clase: {
        type: String,
        default: ""
    },
    condicion_de_servicio: {
        type: String,
        default: ""
    },
    marca: {
        type: String,
        default: ""
    },
    tension: {
        type: String,
        default: ""
    },
    potencia: {
        type: String,
        default: ""
    },
    num_fabrica: {
        type: String,
        default: ""
    },
    ano_fabricacion: {
        type: Number,
        default: null
    },
    fecha_puesta_en_marcha: {
        type: Date,
        default: null
    },
    grupo_conexion: {
        type: String,
        default: ""
    },
    regulacion: {
        type: String,
        default: ""
    },
    impedancia_cc_u1u2: {
        type: Number,
        default: null
    },
    impedancia_cc_u1u3: {
        type: Number,
        default: null
    },
    impedancia_cc_u1u3: {
        type: Number,
        default: null
    },
    Z012: {
        type: Number,
        default: null
    },
    Z013: {
        type: Number,
        default: null
    },
    Z023: {
        type: Number,
        default: null
    },
    Z01: {
        type: Number,
        default: null
    },
    perdidas_en_vacio: {
        type: Number,
        default: null
    },
    saturacion: {
        type: Number,
        default: null
    },
    sistema_dilatacion_aceite: {
        type: String,
        default: ""
    },
    refrigeracion: {
        type: String,
        default: ""
    },
    tipo_de_aislante: {
        type: String,
        default: ""
    },
    volumen_aceite: {
        type: Number,
        default: null
    },
    peso_descubado: {
        type: Number,
        default: null
    },
    peso_total: {
        type: Number,
        default: 0
    },
    RBC_marca: {
        type: String,
        default: ""
    },
    RBC_numero_de_serie: {
        type: String,
        default: ""
    },
    RBC_ano: {
        type: Number,
        default: 0
    },
    RBC_modelo: {
        type: String,
        default: ""
    },
    RBC_conexion: {
        type: String,
        default: ""
    },
    RBC_modelo_comando_motor: {
        type: String,
        default: ""
    },
    observaciones: {
        type: String,
        default: ""
    },
    foto_placa: {
        type: String,
        default: ""
    },
    pertenece_a_red_de_transporte: {
        type: String,
        default: ""
    },
    atendido_por: {
        type: String,
        default: ""
    },
    zona: {
        type: String,
        default: ""
    },
})

//creación model
module.exports = mongoose.model("maquina", maquinasSchema, 'equipos')