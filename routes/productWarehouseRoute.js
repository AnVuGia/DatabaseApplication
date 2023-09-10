const express = require('express');
const router = express.Router();
const productWarehouseController = require('../controllers/productWarehouseController');

router.post('/findAll', productWarehouseController.findAll);

module.exports = router;
