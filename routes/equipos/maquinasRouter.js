var express = require('express');
var router = express.Router();

const maquinasController = require("../../controllers/equipos/maquinasController")

/* GET */
router.get('/', maquinasController.getAll);
router.post('/', maquinasController.addAllMaquinas);
router.post('/actualizar-historiales', maquinasController.actualizarHistoriales);
router.post('/borrar-historiales', maquinasController.borrarHistoriales);

module.exports = router;