const equiposModel = require("../models/equiposModel")

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
            const documents = await equiposModel.find({})
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        try {
            const document = await equiposModel.create(req.body);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}