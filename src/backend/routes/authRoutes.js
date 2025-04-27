const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Rota de login
router.post('/login', loginController.login);  // Rota de login, sem necessidade de verificação de token

module.exports = router;

