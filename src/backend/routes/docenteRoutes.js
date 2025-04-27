const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../controllers/authController'); 

// Rota protegida para o dashboard de docente
router.get('/dashboard', verificarToken, authController.verificarDocente, (req, res) => {
  res.render('docenteDashboard');  // Página do painel de docente
});

module.exports = router;
