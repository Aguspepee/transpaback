const operacionesModel = require("../models/operacionesModel")

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
            const documents = await operacionesModel.find({})
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        console.log(req.body)
        const operaciones = req.body.map((operacion) => {
            let FENT = new Date(operacion.FENT)
            FENT.setHours(operacion.HENT, operacion.MENT)

            let FSAL = new Date(operacion.FSAL)
            FSAL.setHours(operacion.HSAL, operacion.MSAL)

            let FINF = new Date(operacion.FINF)
            FINF.setHours(operacion.HINF, operacion.MINF)

            return ({ ...operacion, FENT: FENT, FSAL: FSAL, FINF: FINF })
        })

        try {
            const document = await operacionesModel.create(req.body);
            console.log("se creo", document);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}