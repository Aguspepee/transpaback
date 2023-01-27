var express = require('express');
var router = express.Router();

const piquetesController = require("../controllers/piquetesController.js")

/* GET */
router.get('/', piquetesController.getAll);
router.get('/zonas', piquetesController.getZonas);
router.get('/lineas', piquetesController.getLineas);
router.get('/piquetes-por-linea', piquetesController.getPiquetesPorLinea);
router.get('/lineas-novedades', piquetesController.getNovedades);
router.get('/cantidad-inspecciones', piquetesController.getCantidadInspecciones);

module.exports = router;