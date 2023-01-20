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

const filtroReparadas = (reparadas) => {
    console.log(reparadas)
    return (
        reparadas === 'false' ?
            {
                '$match': {
                    "valor_medido": 0
                }
            } : {
                '$match': {
                    "valor_medido": 1
                }
            }
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
                                '$sort': {'fecha':-1}
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
                            //filtroReparadas(req.query.reparadas==='true' ? 'true')
                        ],
                        'as': 'novedades_reparadas'
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