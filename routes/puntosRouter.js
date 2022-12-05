var express = require('express');
var router = express.Router();

const puntosController = require("../controllers/puntosController.js")

/* GET */
router.get('/', puntosController.getAll);
router.post('/',puntosController.createAll);

module.exports = router;