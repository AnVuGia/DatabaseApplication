const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/findAll', productController.findAll);
router.post('/search', productController.search);
router.post('/filter', productController.filterProductByAttributeValue);
router.post('/find/:seller_id', productController.getAllProductBySeller);
router.post('/update/:product_id', productController.update);
router.post('/delete/:product_id', productController.delete);

router.post('/create', productController.create);

module.exports = router;
