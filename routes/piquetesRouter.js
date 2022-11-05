var express = require('express');
var router = express.Router();

const piquetesController = require("../controllers/piquetesController.js")

/* GET */
router.get('/', piquetesController.getAll);
router.get('/zonas', piquetesController.getZonas);
router.get('/lineas', piquetesController.getLineas);
router.get('/lineas-novedades', piquetesController.getNovedades);

module.exports = router;