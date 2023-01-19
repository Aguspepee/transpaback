const puntosModel = require("../../models/puntosModel")

const DCF_filters = (fecha_inicio, fecha_fin) => {

  return (
    [
    {
      $match: {
        IDEQ: { $ne: "" },
        remunera: { $eq: "SI" },
        alta: { $ne: null }
      }
    },
    {
      $addFields: {
        baja: {
          $ifNull: ["$fecha_fin", new Date()],
        },
      },
    },
    {
      $lookup: {
        from: "indisponibilidades",
        let: {
          ideq: "$IDEQ",
          fecha_inicio: "$alta",
          fecha_fin: "$baja",
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
                    $lt: ["$Cl", 5],
                  },
                  {
                    $gt: ["$Cl", 0],
                  },
                  {
                    $eq: ["$Elem", "S"],
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
              "$alta",
              "$baja",
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
        codigo: 1,
        numero: 1,
        IDEQ: 1,
        tension: 1,
        usuario: 1,
        longitud_oficial: 1,
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
        fecha_inicio: "$alta",
        fecha_fin: "$baja",
        horas_indisponibles_ano_movil: {
          $sum: "$indisponibilidades.duracion_ano_movil",
        },
        propietario: 1,
      },
    },
    {
      $sort: {
        codigo: 1,
      },
    }
  ])
}

module.exports = {
  DCF_value: async function ({ fecha_inicio, fecha_fin }) {
    try {

      const documents = await puntosModel.aggregate(

        DCF_filters(fecha_inicio, fecha_fin).concat([

          {
            $group: {
              _id: "",
              H_tot: {
                $sum: "$horas_totales_ano_movil",
              },
              h_tot: {
                $sum: "$horas_indisponibles_ano_movil",
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
                            $divide: ["$h_tot", "$H_tot"],
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
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            $project: {
              _id: 0,
              H_tot: 0,
              h_tot: 0,
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

  DCF_detail_list: async function ({ fecha_inicio, fecha_fin, sort }) {
    try {

      const documents = await puntosModel.aggregate(

        DCF_filters(fecha_inicio, fecha_fin).concat([
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