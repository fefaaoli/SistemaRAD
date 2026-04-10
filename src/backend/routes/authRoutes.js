// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rotas protegidas
router.get('/verify', authMiddleware, authController.verify);
router.post('/definir-senha', authMiddleware, authController.definirSenha);

module.exports = router;
