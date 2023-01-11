const lineasModel = require("../../models/lineasModel")

const DLP_filters = (fecha_inicio, fecha_fin) => {


  return ([
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
                $eq: ["$Cl", 5],
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
            '$lookup': {
              'from': 'clases',
              'localField': 'Cl',
              'foreignField': 'codigo',
              'as': 'clase_detalle'
            }
          },
          {
            '$lookup': {
              'from': 'causas',
              'localField': 'Causa',
              'foreignField': 'codigo',
              'as': 'causa_detalle'
            }
          }
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
        tension: 1,
        codigo: 1,
        propietario_2: 1,
        longitud_oficial: 1,
        indisponibilidades: {
          $filter: {
            input: '$indisponibilidades',
            as: 'indisponibilidad',
            cond: { $gt: ['$$indisponibilidad.duracion_ano_movil', 0] }
          }
        },
        horas_totales_ano_movil: 1,
        fecha_inicio: 1,
        fecha_fin: 1,
        IDEQ: 1,
        horas_indisponibles_ano_movil: {
          $sum: "$indisponibilidades.duracion_ano_movil",
        }
      },
    },
    {
      $addFields: {
        HxL: {
          $multiply: [
            "$horas_totales_ano_movil",
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

  ])
}


module.exports = {
  DLP_value: async function ({ fecha_inicio, fecha_fin }) {
    try {
      const documents = await lineasModel.aggregate(

        DLP_filters(fecha_inicio, fecha_fin).concat([
          {
            $group: {
              _id: "",
              HxL_tot: {
                $sum: "$HxL",
              },
              hxl_tot: {
                $sum: "$hxl",
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
                            $divide: ["$hxl_tot", "$HxL_tot"],
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
              HxL_tot: 0,
              hxl_tot: 0,
            },
          },
        ])
      )
      return (documents[0].value)

    } catch (e) {
      console.log(e)
      e.status = 400
    }

  },

  DLP_detail_list: async function ({ fecha_inicio, fecha_fin, sort }) {
    try {
      const documents = await lineasModel.aggregate(
        DLP_filters(fecha_inicio, fecha_fin).concat([
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
        ])
      )
      return (documents)
    } catch (e) {
      console.log(e)
      e.status = 400
    }
  },

}