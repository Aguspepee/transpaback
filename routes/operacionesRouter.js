var express = require('express');
var router = express.Router();

const operacionesController = require("../controllers/operacionesController.js")

/* GET */
router.get('/', operacionesController.getAll);
router.post('/',operacionesController.createAll);

module.exports = router;