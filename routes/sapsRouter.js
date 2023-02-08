const express = require("express");
const router = express.Router();
const sapsController = require("../controllers/sapsController");

//----RUTAS GENERALES----//
//Obtener TODOS los documentos de la base de datos SAP (saps)
router.get('/',sapsController.getAll)
router.get('/resumen',sapsController.getResumen)
//Elimina TODOS los documentos a la base de datos SAP (saps)
router.delete('/',sapsController.deleteAll)
//Carga TODOS los documentos a la base de datos SAP (saps)
router.post('/',sapsController.createAll)

//----RUTAS PARTICULARES----//
//Obtener matriz con las rutas entre las fechas 
router.get('/filterGeneral/:Month-:Year-:Cl_actividad_PM-:Clase_de_orden-:Grupo_planif-:Texto_breve-:Pto_tbjo_resp-:Operacion-:BorrarDuplicados',sapsController.filterGeneral)

//Obrener distribución de horas 
router.get('/DistibucionHoraria/:Month-:Year-:Grupo_planif',sapsController.distribucionHoraria)

//Resumen anual por mes
router.get('/resumenAnual',sapsController.resumenAnual)


module.exports = router;