const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.post('/add-order', ordersController.addOrder);
router.post(
  '/get-orders-by-customer-id',
  ordersController.getOrdersByCustomerId
);

module.exports = router;