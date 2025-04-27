const express = require('express');
const router = express.Router();
const dataLimiteController = require('../controllers/dataLimiteController');

// Definir ou atualizar a data limite
router.post('/configurar-data-limite', dataLimiteController.definirDataLimite);

// Buscar a data limite de um período
router.get('/buscar-data-limite/:periodo', dataLimiteController.buscarDataLimite);

module.exports = router;
