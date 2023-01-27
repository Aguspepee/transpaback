const piquetesModel = require("../models/piquetesModel")

//Filtra por un array de areas. 
const filtroZonas = (zonas) => {
    return (
        !(zonas === undefined || zonas.length == 0) ?
            {
                '$match': {
                    'area': {
                        '$in': zonas.split(',')
                    }
                }
            } : { '$match': {} }
    )
}

const filtroLineas = (lineas) => {
    return (
        !(lineas === undefined || lineas.length == 0) ?
            {
                '$match': {
                    'linea': {
                        '$in': lineas.split(',')
                    }
                }
            } : { '$match': {} }
    )
}
const mostrarHistorico = (historico) => {
    return (
        historico === 'false' ?
            {
                '$group': {
                    '_id': [
                        '$equipo', '$codigo_valorac', '$denominacion'
                    ],
                    'fecha': {
                        '$first': '$fecha'
                    },
                    'orden': {
                        '$first': '$orden'
                    },
                    'equipo': {
                        '$first': '$equipo'
                    },
                    'denominacion': {
                        '$first': '$denominacion'
                    },
                    'codigo_valorac': {
                        '$first': '$codigo_valorac'
                    },
                    'codif_txt_cod': {
                        '$first': '$codif_txt_cod'
                    },
                    'valor_medido': {
                        '$first': '$valor_medido'
                    }
                }
            } : { '$match': {} }
    )
}

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await piquetesModel.aggregate([
                filtroZonas(req.query.zonas),
                filtroLineas(req.query.lineas)
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
    getZonas: async function (req, res, next) {
        try {
            const documents = await piquetesModel.aggregate([
                {
                    '$group': {
                        '_id': '$area',
                        'value': {
                            '$first': '$area'
                        }
                    }
                }, {
                    '$unset': '_id'
                }, {
                    '$sort': { 'value': 1 }
                }
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getLineas: async function (req, res, next) {
        try {
            const documents = await piquetesModel.aggregate([
                filtroZonas(req.query.zonas),
                {
                    '$group': {
                        '_id': '$linea',
                        'value': {
                            '$first': '$linea'
                        }
                    }
                }, {
                    '$unset': '_id'
                }, {
                    '$sort': { 'value': 1 }
                }
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getPiquetesPorLinea: async function (req, res, next) {
        
        try {
            const documents = await piquetesModel.aggregate([
                {
                    '$match': {
                        'latitud': {
                            '$ne': null
                        }
                    }
                },
                { $sort: { equipo: 1 } },
                {
                    '$group': {
                        '_id': ['$linea', '$area'],
                        'linea': { '$first': '$linea' },
                        'zona': { '$first': '$area' },
                        'piquetes': {
                            '$push': '$$ROOT'
                        }
                    }
                }
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getNovedades: async function (req, res, next) {
        try {
            const documents = await piquetesModel.aggregate([
                filtroZonas(req.query.zonas),
                filtroLineas(req.query.lineas),
                {
                    '$lookup': {
                        'from': 'novedades',
                        'let': {
                            'equipo': '$equipo'
                        },
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$ne': [
                                            '$codigo_valorac', ''
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                            '$equipo', '$$equipo'
                                        ]
                                    }
                                }
                            },
                            {
                                '$sort': { 'fecha': -1 }
                            }
                        ],
                        'as': 'novedades_list'
                    }
                },
                {
                    '$lookup': {
                        'from': 'novedades',
                        'let': {
                            'equipo': '$equipo'
                        },
                        'pipeline': [

                            {
                                '$match': {
                                    '$expr': {
                                        '$ne': [
                                            '$codigo_valorac', ''
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$and': [
                                        { 'fecha': { '$gte': new Date(req.query.fecha_inicio) } },
                                        { 'fecha': { '$lte': new Date(req.query.fecha_fin) } }
                                    ]
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                            '$equipo', '$$equipo'
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$in': [
                                            '$codigo_valorac', req.query.codigos?.split(",")
                                        ]
                                    }
                                }
                            },
                            {
                                '$sort': {
                                    'fecha': -1
                                }
                            },
                            mostrarHistorico('false'),
                            {
                                '$match': {
                                    "valor_medido": 0
                                }
                            }
                        ],
                        'as': 'novedades_abiertas'
                    }
                },
                {
                    '$lookup': {
                        'from': 'novedades',
                        'let': {
                            'equipo': '$equipo'
                        },
                        'pipeline': [

                            {
                                '$match': {
                                    '$expr': {
                                        '$ne': [
                                            '$codigo_valorac', ''
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$and': [
                                        { 'fecha': { '$gte': new Date(req.query.fecha_inicio) } },
                                        { 'fecha': { '$lte': new Date(req.query.fecha_fin) } }
                                    ]
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                            '$equipo', '$$equipo'
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$in': [
                                            '$codigo_valorac', req.query.codigos?.split(",")
                                        ]
                                    }
                                }
                            },
                            {
                                '$sort': {
                                    'fecha': -1
                                }
                            },
                            mostrarHistorico('false'),
                            {
                                '$match': {
                                    "valor_medido": 1
                                }
                            }
                        ],
                        'as': 'novedades_reparadas'
                    }
                },
                {
                    '$lookup': {
                        'from': 'novedades',
                        'let': {
                            'equipo': '$equipo'
                        },
                        'pipeline': [

                            {
                                '$match': {
                                    '$expr': {
                                        '$ne': [
                                            '$codigo_valorac', ''
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$and': [
                                        { 'fecha': { '$gte': new Date(req.query.fecha_inicio) } },
                                        { 'fecha': { '$lte': new Date(req.query.fecha_fin) } }
                                    ]
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                            '$equipo', '$$equipo'
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$in': [
                                            '$codigo_valorac', [req.query.inspecciones]
                                        ]
                                    }
                                }
                            },
                            {
                                '$sort': {
                                    'fecha': -1
                                }
                            },
                            mostrarHistorico('true'),
                            {
                                '$match': {
                                    "valor_medido": 1
                                }
                            }
                        ],
                        'as': 'inspecciones'
                    }
                },
                {
                    $addFields: {
                        inspecciones: { $cond: { if: { $isArray: "$inspecciones" }, then: { $size: "$inspecciones" }, else: 0 } },
                    }
                },

            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getCantidadInspecciones: async function (req, res, next) {
        try {
            const documents = await piquetesModel.aggregate([
                filtroZonas(req.query.zonas),
                filtroLineas(req.query.lineas),
                {
                    '$lookup': {
                        'from': 'novedades',
                        'let': {
                            'equipo': '$equipo'
                        },
                        'pipeline': [

                            {
                                '$match': {
                                    '$expr': {
                                        '$ne': [
                                            '$codigo_valorac', ''
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$and': [
                                        { 'fecha': { '$gte': new Date(req.query.fecha_inicio) } },
                                        { 'fecha': { '$lte': new Date(req.query.fecha_fin) } }
                                    ]
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                            '$equipo', '$$equipo'
                                        ]
                                    }
                                }
                            },
                            {
                                '$match': {
                                    '$expr': {
                                        '$in': [
                                            '$codigo_valorac', [req.query.inspecciones]
                                        ]
                                    }
                                }
                            },
                            {
                                '$sort': {
                                    'fecha': -1
                                }
                            },
                            mostrarHistorico('true'),
                            {
                                '$match': {
                                    "valor_medido": 1
                                }
                            }
                        ],
                        'as': 'inspecciones'
                    }
                },
                {
                    $addFields: {
                        inspecciones: { $cond: { if: { $isArray: "$inspecciones" }, then: { $size: "$inspecciones" }, else: 0 } },
                    }
                },
                {
                    $group: {
                        _id: "$inspecciones",
                        cantidad: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }

            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },


}