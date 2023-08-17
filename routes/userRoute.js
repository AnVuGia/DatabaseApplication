const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create-user', userController.saveUser);
router.get('/login', userController.getLoginView);
router.post('/login', userController.getUserByUsernameAndPassword);
module.exports = router;
