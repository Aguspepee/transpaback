const lineasModel = require("../models/lineasModel")
const DLF = require("./reportes/DLF").DLF
const DLP = require("./reportes/DLP").DLP
const DCF = require("./reportes/DCF").DCF
const DTN = require("./reportes/DTN").DTN

module.exports = {
    DIMA: async function (req, res, next) {
        //process.env.TZ = "Europe/Amsterdam"
        console.log(process.env.TZ)
        //Se determina el mes y el año para el cual se calculará el DIMA
        const month = req.query.month || 5
        const year = req.query.year || 2019
        //Se determina la fecha de inicio del mes y la fecha de fin del mes
        const inicio_mes = new Date(year, month - 1, 1)
        //Se determina la fecha de inicio del año movil y la fecha de fin de año movil
        const fin_mes = new Date(year, month, 0)
        console.log(inicio_mes, fin_mes)

        try {

            //DLF - Disponibilidad media anual movil de salidad de líneas forzadas
            const DLF_value = await DLF({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DLP_value = await DLP({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DCF_value = await DCF({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DTN_value = await DTN({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })

            const DIMA = { DLF: DLF_value, DLP: DLP_value, DCF: DCF_value, DTN: DTN_value }
            res.json(DIMA)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}