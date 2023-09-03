const express = require('express');
const router = express.Router();
const mongoController = require('../controllers/mongoController');

router.post('/api/:collection/create', mongoController.create);
router.post('/api/:collection/update', mongoController.update);
router.delete('/api/:collection/delete', mongoController.delete);
router.get('/api/:collection/find/:name', mongoController.find);
router.get('/api/:collection/find/', mongoController.findAll);

module.exports = router;