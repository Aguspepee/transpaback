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
    console.log(lineas)
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
        console.log("zonas")
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
        console.log("lineas")
        try {
            const documents = await piquetesModel.aggregate([
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
                        'localField': 'equipo',
                        'foreignField': 'equipo',
                        'as': 'novedades'
                    }
                }
                /* {
                    '$lookup': {
                        'from': 'novedades',
                        'let': {
                            'equipo': '$equipo'
                        },
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$eq': [
                                            '$equipo', '$$equipo'
                                        ]
                                    }
                                }
                            }, {
                                '$match': {
                                    '$expr': {
                                        '$in': [
                                            '$codigo_valorac', [
                                                'PINT', 'PINM', 'LA01'
                                                //'LA01'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        'as': 'novedades'
                    }
                }, {
                    '$match': {
                        'novedades': {
                            '$ne': []
                        }
                    }
                } */
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}