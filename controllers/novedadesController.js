const novedadesModel = require("../models/novedadesModel")

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
                    "codigo_Interno": {
                        '$in': lineas.split(',')
                    }
                }
            } : { '$match': {} }
    )
}

const filtroCodigos = (codigos) => {
    console.log(codigos)
    return (
        !(codigos === undefined || codigos.length == 0) ?
            {
                '$match': {
                    'codigo_valorac': {
                        '$in': codigos.split(',')
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
                    '$lookup': {
                        'from': 'piquetes',
                        'localField': 'equipo',
                        'foreignField': 'equipo',
                        'as': 'piquete'
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

    createAll: async function (req, res, next) {
        try {
          const document = await lineasNovedadesModel.create(req.body);
          console.log("se creo", document);
          res.json(document);
        } catch (e) {
          console.log(e);
          e.status = 400;
          next(e);
        }
      },
}