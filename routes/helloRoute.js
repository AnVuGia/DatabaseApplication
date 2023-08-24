const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');

router.get('/', helloController.getHello);
router.get('/seller', helloController.getSeller);
router.get('/customers', helloController.getCustomers);
module.exports = router;
