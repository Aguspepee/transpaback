var express = require('express');
var router = express.Router();

const novedadesController = require("../controllers/novedadesController.js")

/* GET */
router.get('/', novedadesController.getAll);
router.get('/withmeta', novedadesController.getWithMeta);
router.get('/cantidades', novedadesController.getCantidades);
router.post('/',novedadesController.createAll); 

module.exports = router;