const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCategoryController');

router.get('/find/:product_id', productCategoryController.findAtribute);

module.exports = router;