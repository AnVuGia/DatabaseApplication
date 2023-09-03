const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/findAll', productController.findAll);
router.post('/search', productController.search);
// router.post('/category/update', categoryController.update);
// router.post('/category/delete', categoryController.delete);

router.post('/create', productController.create);

module.exports = router;