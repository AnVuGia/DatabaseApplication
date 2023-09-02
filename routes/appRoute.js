const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

router.get('/', appController.getHello);
router.get('/login', appController.getLogin);
router.get('/signup', appController.getSignup);
router.get('/seller-product', appController.getSellerProduct);
router.get('/seller-inbound', appController.getSellerInbound);
router.get('/admin-inventory', appController.getAdminVentory);
router.get('/admin-category', appController.getAdminCategory);
router.get('/customers', appController.getCustomers);
router.get('/product-detail', appController.getProductDetail);
module.exports = router;
