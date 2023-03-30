const novedadesModel = require("../models/novedadesModel")

//Filtra por un array de areas. 
const filtroZonas = (zonas) => {
    return (
        !(zonas === undefined || zonas.length == 0) ?
            {
                '$match': {
                    'piquete.area': {
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
                    "codigo_interno": {
                        '$in': lineas.split(',')
                    }
                }
            } : { '$match': {} }
    )
}

const filtroReparadas = (reparadas) => {
    return (
        reparadas === 'false' ?
            {
                '$match': {
                    "valor_medido": 0
                }
            } : { '$match': {} }
    )
}

const filtroCodigos = (codigos) => {
    return (
        {
            '$match': {
                'codigo_valorac': {
                    '$in': codigos?.split(',')
                }
            }
        }
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
            const documents = await novedadesModel.find({})

            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getWithMeta: async function (req, res, next) {
        try {
            const documents = await novedadesModel.aggregate([

                filtroLineas(req.query.lineas),
                filtroCodigos(req.query.codigos),
                {
                    '$sort': {
                        'fecha': -1
                    }
                },
                mostrarHistorico(req.query.historico),
                {
                    '$lookup': {
                        'from': 'piquetes',
                        'localField': 'equipo',
                        'foreignField': 'equipo',
                        'as': 'piquete'
                    }
                },
                {
                    '$match': {
                        '$expr': {
                            '$ne': [
                                '$codigo_valorac', ""
                            ]
                        }
                    }
                },
                filtroZonas(req.query.zonas),
                filtroReparadas(req.query.reparadas),
                {
                    '$sort': {
                        'fecha': -1
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

    getCantidades: async function (req, res, next) {
        try {
            const documents = await novedadesModel.aggregate([

                filtroLineas(req.query.lineas),
                //filtroCodigos(req.query.codigos),
                {
                    '$sort': {
                        'fecha': -1
                    }
                },
                mostrarHistorico(req.query.historico),
                {
                    '$lookup': {
                        'from': 'piquetes',
                        'localField': 'equipo',
                        'foreignField': 'equipo',
                        'as': 'piquete'
                    }
                },
                {
                    '$match': {
                        '$expr': {
                            '$ne': [
                                '$codigo_valorac', ""
                            ]
                        }
                    }
                },
                filtroZonas(req.query.zonas),
                filtroReparadas(req.query.reparadas),
                {
                    '$sort': {
                        'fecha': -1
                    }
                },
                {
                    '$match': {
                        'codigo_valorac': {
                            '$nin': [
                                'PINT', 'PINS', 'PINM', 'SNOV'
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$codigo_valorac",
                        reparadas: { $sum: { $cond: [{ $eq: ["$valor_medido", 1] }, 1, 0] } },
                        abiertas: { $sum: { $cond: [{ $eq: ["$valor_medido", 0] }, 1, 0] } }
                    }
                },
                {
                    '$addFields': {
                        total: { $sum: ["$reparadas", "$abiertas"] }
                    }
                },
                req.query.reparadas?
                {
                    '$sort': {
                        'total': -1,
                    }
                }:
                {
                    '$sort': {
                        'abiertas': -1,
                    }
                }
                ,
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        const novedades = req.body.map((novedad) => {
            var fecha_str = novedad.fecha.split("/");
            var fecha = new Date(+fecha_str[2], fecha_str[1] - 1, +fecha_str[0]);
            return ({ ...novedad, fecha: fecha })
        })
        try {
            const document = await novedadesModel.create(novedades);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}