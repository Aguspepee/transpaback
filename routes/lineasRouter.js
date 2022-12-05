var express = require('express');
var router = express.Router();

const lineasController = require("../controllers/lineasController.js")

/* GET */
router.get('/', lineasController.getAll);
router.post('/',lineasController.createAll);

module.exports = router;