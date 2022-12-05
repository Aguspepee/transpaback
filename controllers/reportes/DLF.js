const lineasModel = require("../../models/lineasModel")

module.exports = {
    DLF: async function ({ fecha_inicio, fecha_fin }) {
        try {

            //DLF - Disponibilidad media anual movil de salidad de líneas forzadas
            const documents = await lineasModel.aggregate([
                {
                    $match: {
                        IDEQ: {
                            $ne: "",
                        },
                    },
                },
                {
                    $match: {
                        fecha_inicio: {
                            $ne: null,
                        },
                    },
                },
                {
                    $addFields: {
                        fecha_fin: {
                            $ifNull: ["$fecha_fin", new Date()],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "indisponibilidades",
                        let: {
                            ideq: "$IDEQ",
                            fecha_inicio: "$fecha_inicio",
                            fecha_fin: "$fecha_fin",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$IDEQ", "$$ideq"],
                                    },
                                },
                            },
                            //Filtro por programadas:
                            //  - Cl 5: Programadas
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $ne: ["$Cl", 3.3],
                                            },
                                            {
                                                $ne: ["$Cl", 3.7],
                                            },
                                            {
                                                $gt: ["$Cl", 0],
                                            },
                                            {
                                                $lt: ["$Cl", 5],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    duracion_ano_movil: {
                                        $function: {
                                            body: `function (
                                                SALIDA,
                                                ENTRADA,
                                                inicio_ano_movil,
                                                fin_ano_movil
                                            ) {
                                                let inicio;
                                                let fin;
                                                let resultado;
                                                if (
                                                    ENTRADA >= inicio_ano_movil &&
                                                    SALIDA <= fin_ano_movil
                                                ) {
                                                    if (SALIDA >= inicio_ano_movil) {
                                                        inicio = SALIDA;
                                                    } else {
                                                        inicio = inicio_ano_movil;
                                                    }
                                                    if (ENTRADA <= fin_ano_movil) {
                                                        fin = ENTRADA;
                                                    } else {
                                                        fin = fin_ano_movil;
                                                    }
                                                    resultado =
                                                        (fin - inicio) / (1000 * 60 * 60);
                                                } else {
                                                    resultado = 0;
                                                }
                                                return resultado;
                                            }`,
                                            args: [
                                                "$SALIDA",
                                                "$ENTRADA",
                                                new Date("2016-01-01T00:00:00.000+00:00"),
                                                new Date("2017-01-01T00:00:00.000+00:00"),
                                            ],
                                            lang: "js",
                                        },
                                    },
                                },
                            },
                        ],
                        as: "indisponibilidades",
                    },
                },
                {
                    $addFields: {
                        horas_totales_ano_movil_A: {
                            $function: {
                                body: `function (
                                    fecha_inicio,
                                    fecha_fin,
                                    inicio_ano_movil,
                                    fin_ano_movil
                                ) {
                                    let inicio;
                                    let fin;
                                    let resultado;
                                    let fecha_fin_corregida =
                                        fecha_fin || new Date();
                                    if (
                                        fecha_fin >= inicio_ano_movil &&
                                        fecha_inicio <= fin_ano_movil
                                    ) {
                                        if (fecha_inicio >= inicio_ano_movil) {
                                            inicio = fecha_inicio;
                                        } else {
                                            inicio = inicio_ano_movil;
                                        }
                                        if (fecha_fin <= fin_ano_movil) {
                                            fin = fecha_fin;
                                        } else {
                                            fin = fin_ano_movil;
                                        }
                                        resultado = (fin - inicio) / (1000 * 60 * 60);
                                    } else {
                                        resultado = 0;
                                    }
                                    return resultado;
                                }`,
                                args: [
                                    "$fecha_inicio",
                                    "$fecha_fin",
                                    new Date("2016-01-01T00:00:00.000+00:00"),
                                    new Date("2017-01-01T00:00:00.000+00:00"),
                                ],
                                lang: "js",
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        horas_totales_ano_movil_B: {
                            $function: {
                                body: `function (
                                    fecha_inicio,
                                    fecha_fin,
                                    inicio_ano_movil,
                                    fin_ano_movil
                                ) {
                                    let inicio;
                                    let fin;
                                    let resultado;
                                    let fecha_fin_corregida =
                                        fecha_fin || new Date();
                                    if (
                                        fecha_fin >= inicio_ano_movil &&
                                        fecha_inicio <= fin_ano_movil
                                    ) {
                                        if (fecha_inicio >= inicio_ano_movil) {
                                            inicio = fecha_inicio;
                                        } else {
                                            inicio = inicio_ano_movil;
                                        }
                                        if (fecha_fin <= fin_ano_movil) {
                                            fin = fecha_fin;
                                        } else {
                                            fin = fin_ano_movil;
                                        }
                                        inicio.setMonth(inicio.getMonth() + 1);
                                        inicio.setDate(0);
                                        fin.setMonth(fin.getMonth() + 1);
                                        fin.setDate(0);
                                        resultado = (fin - inicio) / (1000 * 60 * 60);
                                    } else {
                                        resultado = 0;
                                    }
                                    return resultado;
                                }`,
                                args: [
                                    "$fecha_inicio",
                                    "$fecha_fin",
                                    new Date("2016-01-01T00:00:00.000+00:00"),
                                    new Date("2017-01-01T00:00:00.000+00:00"),
                                ],
                                lang: "js",
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        codigo: 1,
                        longitud_oficial: 1,
                        indisponibilidades: 1,
                        horas_totales_ano_movil_A: 1,
                        horas_totales_ano_movil_B: 1,
                        horas_indisponibles_ano_movil: {
                            $sum: "$indisponibilidades.duracion_ano_movil",
                        },
                    },
                },
                {
                    $addFields: {
                        HxL_A: {
                            $multiply: [
                                "$horas_totales_ano_movil_A",
                                "$longitud_oficial",
                            ],
                        },
                        HxL_B: {
                            $multiply: [
                                "$horas_totales_ano_movil_B",
                                "$longitud_oficial",
                            ],
                        },
                        hxl: {
                            $multiply: [
                                "$horas_indisponibles_ano_movil",
                                "$longitud_oficial",
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        codigo: 1,
                    },
                },
                {
                    $group: {
                        _id: "",
                        HxL_tot_A: {
                            $sum: "$HxL_A",
                        },
                        HxL_tot_B: {
                            $sum: "$HxL_B",
                        },
                        hxl_tot: {
                            $sum: "$hxl",
                        },
                    },
                },
                {
                    $addFields: {
                        DLF_A: {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $subtract: [
                                                1,
                                                {
                                                    $divide: ["$hxl_tot", "$HxL_tot_A"],
                                                },
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                3,
                            ],
                        },
                        DLF_B: {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $subtract: [
                                                1,
                                                {
                                                    $divide: ["$hxl_tot", "$HxL_tot_B"],
                                                },
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                3,
                            ],
                        },
                    },
                },

            ]
            )
            return (documents)

        } catch (e) {
            console.log(e)
            e.status = 400
        }

    },
   
}