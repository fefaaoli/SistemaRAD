const express = require('express');
const router = express.Router();
const controller = require('../controllers/restricaoController');

// Configura limite geral
router.put('/config', controller.configurarLimite); // Nome corrigido

// Lista restrições
router.get('/:periodo', controller.listarRestricoes);

module.exports = router;