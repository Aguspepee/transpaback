const puntosModel = require("../models/puntosModel")
const dateToStr = require("../util/date-format")

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await puntosModel.find({})
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    createAll: async function (req, res, next) {
        console.log(req.body)
        const puntos = req.body
        try {
            const document = await puntosModel.create(puntos);
            console.log("se creo", document);
            res.json(document);
        } catch (e) {
            console.log(e);
            e.status = 400;
            next(e);
        }
    },
}