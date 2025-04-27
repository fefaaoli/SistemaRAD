const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Conexão com o banco de dados
const adminController = require('../controllers/adminController');  
const { verificarToken, verificarAdmin } = require('../controllers/authController'); 

// Rota para o dashboard do administrador
router.get('/dashboard', verificarToken, verificarAdmin, (req, res) => {
  res.render('adminDashboard');  
});

// Rota para cadastrar um novo usuário (apenas admin pode acessar)
router.post('/cadastrar-usuario', verificarToken, verificarAdmin, adminController.cadastrarUsuario);

// Rota para editar um usuário existente (apenas admin pode acessar)
router.put('/editar-usuario/:id', verificarToken, verificarAdmin, adminController.editarUsuario);

// Rota para remover um usuário (apenas admin pode acessar)
router.delete('/remover-usuario/:id', verificarToken, verificarAdmin, adminController.removerUsuario);

// Rota para criar o período
router.post('/criar-periodo', verificarToken, verificarAdmin, adminController.criarPeriodo);

// Outras rotas aqui
module.exports = router;
