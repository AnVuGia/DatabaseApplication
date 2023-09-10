const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const authJwt = require('../controllers/auth/roleAccess');
router.get('/', appController.getHello);
router.get('/login', authJwt.isGuest, appController.getLogin);
router.post('/login',authJwt.isGuest,appController.loginAccount);
router.get('/signup', appController.getSignup);
router.post('/signup', appController.signupAccount);
router.get('/seller-product', appController.getSellerProduct);
router.get('/seller-inbound', appController.getSellerInbound);
router.get('/admin-inventory', appController.getAdminVentory);
router.get('/admin-category', appController.getAdminCategory);
router.get('/admin-product', appController.getAdminProduct);
router.get('/customers', authJwt.isCustomer, appController.getCustomers);
router.get('/product-detail', appController.getProductDetail);
router.get('/cart-view', appController.getCart);
router.get('/checkout', appController.getCheckout);
module.exports = router;
