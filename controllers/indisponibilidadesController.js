const indisponibilidadesModel = require("../models/indisponibilidadesModel")
const dateToStr = require("../util/date-format")
const dateTimeToDate = dateToStr.dateTimeToDate


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


module.exports = {
    getAll: async function (req, res, next) {
        const options = {
            page: req.query.page,
            limit: req.query.rowsPerPage,
        };
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        try {
            const documents = await indisponibilidadesModel.aggregate([
                {
                    "$match": {"$expr":[
                        
                    ]}
                },
               
                {
                    "$sort": sort
                },
            ]).paginateExec(options)
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getTable: async function (req, res, next) {
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        try {
            const documents = await indisponibilidadesModel.aggregate([
                {
                    "$match": {"$expr":[
                        
                    ]}
                },
               
                {
                    "$sort": sort
                },
            ])
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        const indisponibilidades = req.body.map((indisponibilidad) => {
            let FENT = dateTimeToDate(indisponibilidad.ENTRADA)
            let FSAL = dateTimeToDate(indisponibilidad.SALIDA)
            return ({ ...indisponibilidad, ENTRADA: FENT, SALIDA: FSAL })
        })
        
        try {
            const document = await indisponibilidadesModel.create(indisponibilidades);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}