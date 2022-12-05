const maquinasModel = require("../../models/equipos/maquinasModel")

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
      const documents = await maquinasModel.find({})
      res.json(documents)
    } catch (e) {
      console.log(e)
      e.status = 400
      next(e)
    }
  },

  addAllMaquinas: async function (req, res, next) {
    bulk = []
    req.body.forEach(item => {
      let updateDoc = {
        'updateOne': {
          'filter': { ID: item.ID },
          'update': item,
          'upsert': false
        }
      }
      bulk.push(updateDoc)
    })
    try {
      const document = await maquinasModel.bulkWrite(bulk)
      //console.log("se creo", document);
      res.json(document);
    } catch (e) {
      console.log(e);
      e.status = 400;
      next(e);
    }
  },

  actualizarHistoriales: async function (req, res, next) {
    bulk = []
    req.body.forEach(item => {
      let updateDoc = {
        'updateOne': {
          'filter': { ID: item.ID },
          'update': {
            $addToSet: {
              historial: [{
                ubicacion_tecnica: item.ubicacion_tecnica,
                fecha_inicio: item.fecha_inicio ? new Date(+item.fecha_inicio.split("/")[2], item.fecha_inicio.split("/")[1] - 1, +item.fecha_inicio.split("/")[0]) : undefined,
                fecha_fin: item.fecha_fin ? new Date(+item.fecha_fin.split("/")[2], item.fecha_fin.split("/")[1] - 1, +item.fecha_fin.split("/")[0]) : undefined,
                condicion: item.condicion
              }]
            }
          },
          'upsert': false
        }
      }
      bulk.push(updateDoc)
    })
    try {
      const document = await maquinasModel.bulkWrite(bulk)
      //console.log("se creo", document);
      res.json(document);
    } catch (e) {
      console.log(e);
      e.status = 400;
      next(e);
    }
  },

  borrarHistoriales: async function (req, res, next) {
    bulk = []
    req.body.forEach(item => {
      let updateDoc = {
        'updateOne': {
          'filter': { ID: item.ID },
          'update': { historial: [] },
          'upsert': false
        }
      }
      bulk.push(updateDoc)
    })
    try {
      const document = await maquinasModel.bulkWrite(bulk)
      //console.log("se creo", document);
      res.json(document);
    } catch (e) {
      console.log(e);
      e.status = 400;
      next(e);
    }
  },
}