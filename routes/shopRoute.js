const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/products', shopController.getAllProducts);
router.post('/add-product', shopController.saveProduct);

module.exports = router;
