const express = require('express');
//create controllers 
const authController = require('../controllers/auth');

const router = express.Router();

//acssess via post method only 
router.post('/register', authController.register);

router.post('/login', authController.login);

module.exports = router;