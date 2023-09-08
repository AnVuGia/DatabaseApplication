const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/add-product', customerController.addToCard);
