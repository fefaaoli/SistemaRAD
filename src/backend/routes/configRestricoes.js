// routes/admin/config.js
const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/ConfigController');
const verificarPrazo = require('../middlewares/verificarPrazo'); // Importa o middleware

// Rota para DEFINIR data limite (PUT)
router.put('/prazos', ConfigController.definirDataLimite);

// Rota para CONSULTAR data limite de um período específico (GET)
router.get('/prazos/:periodo', ConfigController.consultarDataLimite);

// Rota para CONSULTAR a última data limite registrada (GET)
router.get('/ultima-data-limite', ConfigController.consultarUltimaDataLimite);

// Exemplo de rota protegida (usando o middleware):
router.put('/outra-rota', verificarPrazo, (req, res) => {
  // Só executa se a data limite NÃO tiver passado
  res.json({ success: true, message: "Operação permitida!" });
});

module.exports = router;
