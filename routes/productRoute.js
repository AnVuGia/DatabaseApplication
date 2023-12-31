const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/findAll', productController.findAll);
router.post('/search', productController.search);
router.post('/filter', productController.filterProductByAttributeValue);
router.post(
  '/filterProductByCategory',
  productController.filterProductByCategory
);
router.post('/find/:seller_id', productController.getAllProductBySeller);
router.post('/update/:product_id', productController.update);
router.post('/delete/:product_id', productController.delete);
router.post('/filter-name', productController.filter);
router.post('/create', productController.create);
router.post('/createInbound', productController.createInboundOrder);

module.exports = router;
