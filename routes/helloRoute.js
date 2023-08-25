const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');

router.get('/', helloController.getHello);
router.get('/seller', helloController.getSeller);
router.get('/customers', helloController.getCustomers);
router.get('/product-detail', helloController.getProductDetail);
module.exports = router;
