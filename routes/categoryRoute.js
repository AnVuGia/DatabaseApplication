const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/findAll', categoryController.findAll);
router.post('/search', categoryController.search);
router.post('/searchByName', categoryController.searchByName);
router.post('/update', categoryController.update);
router.post('/delete', categoryController.delete);
router.post('/create', categoryController.createCategory);
router.post('/getAttribute', categoryController.getAllAttributesFromCategory);

module.exports = router;