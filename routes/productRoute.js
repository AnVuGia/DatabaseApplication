const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/findAll', productController.findAll);
router.post('/search', productController.search);
router.post('/find', productController.getAllProductBySeller);
router.post('/update', productController.update);
router.post('/delete', productController.delete);

router.post('/create', productController.create);

module.exports = router;
