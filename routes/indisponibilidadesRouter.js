var express = require('express');
var router = express.Router();

const indisponibilidadesController = require("../controllers/indisponibilidadesController.js")

/* GET */
router.get('/', indisponibilidadesController.getAll);
router.get('/table/', indisponibilidadesController.getTable);
router.post('/',indisponibilidadesController.createAll);

module.exports = router;