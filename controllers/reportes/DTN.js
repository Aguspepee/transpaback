const equiposModel = require("../../models/equiposModel")

const DTN_filters = (fecha_inicio, fecha_fin) => {

  return ([{
    $match: {
      IDEQ: {
        $ne: undefined,
      },
    },
  },
  {
    $match: {
      descripcion: {
        $in: [
          "Transformador de Potencia",
          "Autotransformador de Potencia",
        ],
      },
    },
  },
  {
    $unwind: {
      path: "$historial",
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $addFields: {
      fecha_inicio: "$historial.fecha_inicio",
      fecha_fin: "$historial.fecha_fin",
      condicion: "$historial.condicion",
      ubicacion_tecnica: "$historial.ubicacion_tecnica",
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
    $match: {
      condicion: "En servicio",
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
        ut: "$ubicacion_tecnica",
        fecha_inicio: "$fecha_inicio",
        fecha_fin: "$fecha_fin",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$Codi", "$$ut"],
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
                  $gt: ["$ENS_value", 0],
                },
                {
                  $gt: ["$Cl", 0],
                },
                {
                  $lt: ["$Cl", 6],
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
                  fecha_inicio,
                  fecha_fin,
                ],
                lang: "js",
              },
            },
          },
        },
        {
          $addFields: {
            ENS_ponderada: {
              $multiply: [
                "$ENS_value",
                {
                  $divide: [
                    "$duracion_ano_movil",
                    "$Durac",
                  ],
                },
              ],
            },
          },
        },
      ],
      as: "indisponibilidades",
    },
  },
  {
    $addFields: {
      horas_totales_ano_movil: {
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
            fecha_inicio,
            fecha_fin,
          ],
          lang: "js",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      ID: 1,
      ubicacion_tecnica: 1,
      potencia_1: 1,
      IDEQ: 1,
      tension: 1,
      fecha_inicio: 1,
      fecha_fin: 1,
      atendido_por: 1,
      indisponibilidades: {
        $filter: {
          input: "$indisponibilidades",
          as: "indisponibilidad",
          cond: {
            $gt: ["$$indisponibilidad.duracion_ano_movil", 0],
          },
        },
      },
      horas_totales_ano_movil: 1,
      horas_indisponibles_ano_movil: {
        $sum: "$indisponibilidades.duracion_ano_movil",
      },
      ENS_total_ano_movil: {
        $sum: "$indisponibilidades.ENS_ponderada",
      },
    },
  },
  {
    $addFields: {
      HxS: {
        $multiply: [
          "$horas_totales_ano_movil",
          "$potencia_1",
        ],
      },
      hxs: {
        $multiply: [
          "$horas_indisponibles_ano_movil",
          "$potencia_1",
        ],
      },
      hxs_ens: {
        $multiply: ["$ENS_total_ano_movil", "$potencia_1"],
      },
    },
  },
  {
    $match: {
      potencia_1: {
        $ne: NaN,
      },
    },
  },
  {
    $sort: {
      ubicacion_tecnica: 1,
    },
  },
  {
    $match: {
      horas_totales_ano_movil: {
        $gt: 0,
      },
    },
  }])
}


module.exports = {
  DTN_value: async function ({ fecha_inicio, fecha_fin }) {
    try {
      const documents = await equiposModel.aggregate(
        DTN_filters(fecha_inicio, fecha_fin).concat([
          {
            $group: {
              _id: "",
              HxS: {
                $sum: "$HxS",
              },
              hxs: {
                $sum: "$hxs_ens",
              },
            },
          },
          {
            $addFields: {
              value: {
                $round: [
                  {
                    $multiply: [
                      {
                        $subtract: [
                          1,
                          {
                            $divide: ["$hxs", "$HxS"],
                          },
                        ],
                      },
                      100,
                    ],
                  },
                  6,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              HxS: 0,
              hxs: 0,
            },
          },
        ]))
      return (documents[0].value)

    } catch (e) {
      console.log(e)
      e.status = 400
    }

  },
  DTN_detail_list: async function ({ fecha_inicio, fecha_fin, sort }) {
    try {
      const documents = await equiposModel.aggregate(
        DTN_filters(fecha_inicio, fecha_fin).concat([
          {
            $match: {
              horas_totales_ano_movil: {
                $gt: 0
              },
            },
          },
          {
            "$sort": sort
          },
        ]))
      return (documents)

    } catch (e) {
      console.log(e)
      e.status = 400
    }

  },

}