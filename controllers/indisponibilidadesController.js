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
        try {
            const documents = await indisponibilidadesModel.find({})
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        console.log(req.body)
        const indisponibilidades = req.body.map((indisponibilidad) => {

            let FENT = dateTimeToDate(indisponibilidad.ENTRADA)
            let FSAL = dateTimeToDate(indisponibilidad.SALIDA)

            return ({ ...indisponibilidad, ENTRADA: FENT, SALIDA: FSAL })
        })


        try {
            const document = await indisponibilidadesModel.create(indisponibilidades);
            console.log("se creo", document);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}