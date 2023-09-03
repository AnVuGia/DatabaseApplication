const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/category/findAll', categoryController.findAll);
router.post('/category/search', categoryController.search);
router.post('/category/update', categoryController.update);
router.post('/category/delete', categoryController.delete);

router.post('/category/create', categoryController.createCategory);

module.exports = router;