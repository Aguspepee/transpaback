var express = require('express');
var router = express.Router();

const reportesController = require("../controllers/reportesController.js")

/* GET */

//------DIMA-----//
//VALUES
router.get('/DIMA/DIMA-value', reportesController.DIMAValue);
router.get('/DIMA/DLF-value', reportesController.DLFValue);
router.get('/DIMA/DLP-value', reportesController.DLPValue);
router.get('/DIMA/DTN-value', reportesController.DTNValue);
router.get('/DIMA/DCF-value', reportesController.DCFValue);

//ARRAY OF VALUES
router.get('/DIMA/DIMA-array', reportesController.DIMAArray);
router.get('/DIMA/DLF-array', reportesController.DLFArray);
router.get('/DIMA/DLP-array', reportesController.DLPArray);
router.get('/DIMA/DTN-array', reportesController.DTNArray);
router.get('/DIMA/DCF-array', reportesController.DCFArray);
router.get('/DIMA/VPM-array', reportesController.VPMArray);
router.get('/DIMA/FA-array', reportesController.FAArray);

//DATAIL TABLE
router.get('/DIMA/DLF-detail-table', reportesController.DLFDetailTable);
router.get('/DIMA/DLP-detail-table', reportesController.DLPDetailTable);
router.get('/DIMA/DTN-detail-table', reportesController.DTNDetailTable);
router.get('/DIMA/DCF-detail-table', reportesController.DCFDetailTable);



module.exports = router;