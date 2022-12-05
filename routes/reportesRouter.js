var express = require('express');
var router = express.Router();

const reportesController = require("../controllers/reportesController.js")

/* GET */
router.get('/DIMA', reportesController.DIMA);

module.exports = router;