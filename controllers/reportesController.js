const { DLF_detail_list, DLF_value } = require("./reportes/DLF")
const { DLP_detail_list, DLP_value } = require("./reportes/DLP")
const { DTN_detail_list, DTN_value } = require("./reportes/DTN")
const { DCF_detail_list, DCF_value } = require("./reportes/DCF")
const { Kn } = require("../util/Kn")

//Constantes definidas por la resolución
const VB = 99.943556
const VM = 99.977627
const VOI = 99.926521
const SA = 0.0085177

const getInicioFin = ({ month, year }) => {
    //Se determina la fecha de inicio del mes y la fecha de fin del mes
    const inicio_mes = new Date(year - 1, month - 1, 1)
    //Se determina la fecha de inicio del año movil y la fecha de fin de año movil
    const fin_mes = new Date(year, month - 1, 1)
    return ({ inicio_mes, fin_mes })
}

const dateArray = (init, finish) => {

    // Create an empty array to store the date objects
    const dateArray = [];

    // Loop over the range of dates
    for (let d = init; d <= finish; d.setMonth(d.getMonth() + 1)) {
        // Create a new object for the current date with year and month properties
        const dateObj = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
        };

        // Add the date object to the array
        dateArray.push(dateObj);
    }

    // Log the date array
    return (dateArray);
}


module.exports = {
    DIMAValue: async function (req, res, next) {
        //Constantes del DIMA
        const a = 0.50
        const b = 0.05
        const c = 0.40
        const d = 0.05

        try {
            const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
            const DLF = await DLF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DLP = await DLP_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DTN = await DTN_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DCF = await DCF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            const DIMA_value = parseFloat((a * DLF + b * DLP + c * DTN + d * DCF))
            res.json(DIMA_value)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DLFValue: async function (req, res, next) {
        try {
            const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
            const value = await DLF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            res.json(value)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DLPValue: async function (req, res, next) {
        try {
            const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
            const value = await DLP_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            res.json(value)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DTNValue: async function (req, res, next) {
        try {
            const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
            const value = await DTN_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            res.json(value)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DCFValue: async function (req, res, next) {
        try {
            const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
            const value = await DCF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
            res.json(value)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    //--------------ARRAY OF VALUES--------------//
    DIMAArray: async function (req, res, next) {
        //Constantes del DIMA
        const a = 0.50
        const b = 0.05
        const c = 0.40
        const d = 0.05

        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))

        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const DLF = await DLF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DLP = await DLP_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DTN = await DTN_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DCF = await DCF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DIMA_value = parseFloat((a * DLF + b * DLP + c * DTN + d * DCF))
                    return { date: `${date.month}/${date.year}`, data: DIMA_value }
                })
            )
            res.json(data)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DLFArray: async function (req, res, next) {
        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))
        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const res = await DLF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    return { date: `${date.month}/${date.year}`, data: res }
                })
            )
            res.json(data)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DLPArray: async function (req, res, next) {
        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))
        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const res = await DLP_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    return { date: `${date.month}/${date.year}`, data: res }
                })
            )
            res.json(data)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DTNArray: async function (req, res, next) {
        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))
        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const res = await DTN_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    return { date: `${date.month}/${date.year}`, data: res }
                })
            )
            res.json(data)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DCFArray: async function (req, res, next) {
        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))
        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const res = await DCF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    return { date: `${date.month}/${date.year}`, data: res }
                })
            )
            res.json(data)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    VPMArray: async function (req, res, next) {
        //Constantes del DIMA
        const a = 0.50
        const b = 0.05
        const c = 0.40
        const d = 0.05

        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))

        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const DLF = await DLF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DLP = await DLP_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DTN = await DTN_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DCF = await DCF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DIMA_value = parseFloat((a * DLF + b * DLP + c * DTN + d * DCF))
                    return { date: `${date.month}/${date.year}`, data: DIMA_value }
                })
            )

            //Se calcula el VPM (Valor Promedio Móvil) para cada mes

            const VPM = data.map((x, index) => {
                //Suma los últimos 12 elementos
                let sum = 0
                let array = []

                for (let i = index; i > index - 12; i--) {
                    if (data[i]) {
                        sum = sum + data[i].data
                        array.push(data[i].data)
                    }
                }
                let promedio = sum / array.length

                return { data: promedio, date: x.date, }
            });
            res.json(VPM)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    FAArray: async function (req, res, next) {
        //Constantes del DIMA
        const a = 0.50
        const b = 0.05
        const c = 0.40
        const d = 0.05

        const dates = dateArray(new Date(req.query.start), new Date(req.query.end))

        try {
            const data = await Promise.all(
                dates.map(async (date) => {
                    const { inicio_mes, fin_mes } = getInicioFin({ month: date.month || 5, year: date.year || 2019 })
                    const DLF = await DLF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DLP = await DLP_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DTN = await DTN_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DCF = await DCF_value({ fecha_inicio: inicio_mes, fecha_fin: fin_mes })
                    const DIMA_value = parseFloat((a * DLF + b * DLP + c * DTN + d * DCF))
                    return { date: `${date.month}/${date.year}`, data: DIMA_value }
                })
            )

            //Se calcula el VPM (Valor Promedio Móvil) para cada mes

            const VPM = data.map((x, index) => {
                //Suma los últimos 12 elementos
                let sum = 0
                let array = []

                for (let i = index; i > index - 12; i--) {
                    if (data[i]) {
                        sum = sum + data[i].data
                        array.push(data[i].data)
                    }
                }
                let promedio = sum / array.length

                return { data: promedio, date: x.date }
            });

            const FA = VPM.map((x, index) => {
                //Se obtiene el año y el mes del string de la fecha
                const month = Number(x.date.split("/")[0])
                const year = Number(x.date.split("/")[1])
                const date = new Date(year, month - 1, 15) //Dia medio del mes
                const VPM = x.data
                const n = ((year - 2017) + month / 12)<=5 ? (year - 2017) + month / 12 : 5 //numero de año para la resolución
                let value = null
                const VO = VOI + 0.90 * SA * (n - 1) / 5

                //Se obtiene K
                let K = 1
                K = Kn.filter((x) => {
                    return (date >= x.desde && date <= x.hasta)
                })[0]?.K




                if (n < 1) {
                    value = null
                } else if (n === 1) {
                    value = 1
                } else if (n > 1) {
                    //Se analizan los siguientes 3 casos
                    if (VPM >= VO) {
                        value = 1
                    } else if (VOI < VPM && VPM < VO) {
                        value = 1 + (K - 1) * (VO - VPM) / (VO - VOI)
                    } else if (VOI < VPM && VPM < VO) {
                        value = K
                    }

                }
                return { data: value, date: x.date }
            })
            res.json(FA)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    //--------------DETAIL TABLE--------------//
    DLFDetailTable: async function (req, res, next) {
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
        try {
            const documents = await DLF_detail_list({ fecha_inicio: inicio_mes, fecha_fin: fin_mes, sort: sort })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DLPDetailTable: async function (req, res, next) {
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
        try {
            const documents = await DLP_detail_list({ fecha_inicio: inicio_mes, fecha_fin: fin_mes, sort: sort })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DTNDetailTable: async function (req, res, next) {
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
        try {
            const documents = await DTN_detail_list({ fecha_inicio: inicio_mes, fecha_fin: fin_mes, sort: sort })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    DCFDetailTable: async function (req, res, next) {
        var sort = {};
        sort[req.query.orderBy.replace("[", ".").replace("]", "")] = req.query.order === 'asc' ? -1 : 1;
        const { inicio_mes, fin_mes } = getInicioFin({ month: req.query.month || 5, year: req.query.year || 2019 })
        try {
            const documents = await DCF_detail_list({ fecha_inicio: inicio_mes, fecha_fin: fin_mes, sort: sort })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

}