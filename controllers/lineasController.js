const lineasModel = require("../models/lineasModel")
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
            const documents = await lineasModel.find({})
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        console.log(req.body)
        const lineas = req.body


        try {
            const document = await lineasModel.create(lineas);
            console.log("se creo", document);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}