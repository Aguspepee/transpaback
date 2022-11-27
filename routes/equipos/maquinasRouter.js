var express = require('express');
var router = express.Router();

const maquinasController = require("../../controllers/equipos/maquinasController")

/* GET */
//router.get('/', maquinasController.getAll);
router.post('/', maquinasController.addAllMaquinas);

module.exports = router;