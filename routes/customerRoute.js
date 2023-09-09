const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/add-product', customerController.addToCard);
router.post('/get-products', customerController.getCartProducts);
router.post('/delete-product', customerController.deleteFromCart);
module.exports = router;
