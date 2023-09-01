const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');

router.get('/', helloController.getHello);
router.get('/login', helloController.getLogin);
router.get('/signup', helloController.getSignup);
router.get('/seller-product', helloController.getSellerProduct);
router.get('/seller-inbound', helloController.getSellerInbound);
router.get('/admin-inventory', helloController.getAdminVentory);
router.get('/admin-category', helloController.getAdminCategory);
router.get('/customers', helloController.getCustomers);
router.get('/product-detail', helloController.getProductDetail);
module.exports = router;
