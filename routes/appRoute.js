const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const authJwt = require('../controllers/auth/roleAccess');
router.get('/', appController.getHello);
router.get('/login', authJwt.isGuest, appController.getLogin);
router.post('/login', authJwt.isGuest, appController.loginAccount);
router.get('/signup', appController.getSignup);
router.post('/signup', appController.signupAccount);
router.get('/seller-product', authJwt.isSeller, appController.getSellerProduct);
router.get('/seller-inbound', authJwt.isSeller, appController.getSellerInbound);
router.get('/admin-inventory', authJwt.isAdmin, appController.getAdminVentory);
router.get('/admin-category', authJwt.isAdmin, appController.getAdminCategory);
router.get('/admin-product', authJwt.isAdmin, appController.getAdminProduct);
router.get('/customers', authJwt.isCustomer, appController.getCustomers);
router.get(
  '/product-detail',
  authJwt.isCustomer,
  appController.getProductDetail
);
router.get('/cart-view', authJwt.isCustomer, appController.getCart);
router.get('/checkout', authJwt.isCustomer, appController.getCheckout);
module.exports = router;
