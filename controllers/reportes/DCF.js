const puntosModel = require("../../models/puntosModel")

module.exports = {
  DCF: async function ({ fecha_inicio, fecha_fin }) {
    try {

      //DLF - Disponibilidad media anual movil de salidad de líneas forzadas
      const documents = await puntosModel.aggregate([
        {
          $match: {
            IDEQ: {
              $ne: "",
            },
          },
        },
        {
          $match: {
            alta: {
              $ne: null,
            },
          },
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
          $sort: {
            codigo: 1,
          },
        },
        {
          $group: {
            _id: "",
            H_tot_A: {
              $sum: "$horas_totales_ano_movil_A",
            },
            H_tot_B: {
              $sum: "$horas_totales_ano_movil_B",
            },
            h_tot: {
              $sum: "$horas_indisponibles_ano_movil",
            },
          },
        },
        {
          $addFields: {
            DCF_A: {
              $round: [
                {
                  $multiply: [
                    {
                      $subtract: [
                        1,
                        {
                          $divide: ["$h_tot", "$H_tot_A"],
                        },
                      ],
                    },
                    100,
                  ],
                },
                4,
              ],
            },
            DCF_B: {
              $round: [
                {
                  $multiply: [
                    {
                      $subtract: [
                        1,
                        {
                          $divide: ["$h_tot", "$H_tot_B"],
                        },
                      ],
                    },
                    100,
                  ],
                },
                4,
              ],
            },
          },
        },
      ]
      )
      console.log(documents)
      return (documents)

    } catch (e) {
      console.log(e)
      e.status = 400
    }

  },

}