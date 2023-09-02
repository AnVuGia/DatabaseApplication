const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

router.post('/create', warehouseController.create);
router.post('/findAll', warehouseController.findAll);
router.post('/delete', warehouseController.delete);
router.post('/update', warehouseController.update);
module.exports = router;