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

      console.log(updateDoc)
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