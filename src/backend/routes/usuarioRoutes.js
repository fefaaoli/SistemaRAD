// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Rotas SEM autenticação
router.get('/usuarios', UsuarioController.listarUsuarios);
router.post('/usuarios', UsuarioController.adicionarUsuario);
router.put('/usuarios/:id', UsuarioController.atualizarUsuario);
router.delete('/usuarios/:id', UsuarioController.removerUsuario);

module.exports = router;