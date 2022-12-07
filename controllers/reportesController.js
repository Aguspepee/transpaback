const lineasModel = require("../models/lineasModel")
const DLF = require("./reportes/DLF").DLF
const DLP = require("./reportes/DLP").DLP
const DCF = require("./reportes/DCF").DCF
const DTN = require("./reportes/DTN").DTN

module.exports = {
    DIMA: async function (req, res, next) {
        //Constantes del DIMA
        const a = 0.50
        const b = 0.05
        const c = 0.40
        const d = 0.05

        //Se determina el mes y el año para el cual se calculará el DIMA
        //console.log(req.query.year)
        const month = req.query.month || 5
        const year = req.query.year || 2019
        //console.log (month, year)
        //Se determina la fecha de inicio del mes y la fecha de fin del mes
        const inicio_mes = new Date(year - 1, month - 1, 1)
        //Se determina la fecha de inicio del año movil y la fecha de fin de año movil
        const fin_mes = new Date(year, month - 1, 1)

        try {
            //DLF - Disponibilidad media anual movil de salidad de líneas forzadas
            const DLF_value = await DLF({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DLP_value = await DLP({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DTN_value = await DTN({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DCF_value = await DCF({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            
            console.log(DTN_value)

            const DIMA_value = parseFloat((a * DLF_value[0].DLF_A + b * DLP_value[0].DLP_A + c * DTN_value[0].value + d * DCF_value[0].DCF_A).toFixed(4))

            const DIMA = {
                DIMA: DIMA_value,
                DLF: DLF_value[0].DLF_B,
                DLF_meta: DLF_value[0],
                DLP: DLP_value[0].DLP_B,
                DLP_meta: DLP_value[0],
                DTN: DTN_value[0].value,
                DTN_meta: DTN_value[0],
                DCF: DCF_value[0].DCF_B,
                DCF_meta: DCF_value[0]
            }
            res.json(DIMA)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}