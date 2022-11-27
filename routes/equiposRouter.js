var express = require('express');
var router = express.Router();

const equiposController = require("../controllers/equiposController.js")

/* GET */
router.get('/', equiposController.getAll);
router.post('/',equiposController.createAll);

module.exports = router;