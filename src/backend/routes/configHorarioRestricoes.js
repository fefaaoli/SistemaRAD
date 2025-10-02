const express = require('express');
const router = express.Router();
const AdminConfigController = require('../controllers/HorarioConfigController');

// Restrição de Horários
router.get('/restricoes/horario', AdminConfigController.getRestricao);
router.post('/restricoes/horario', AdminConfigController.updateRestricao);
router.get('/restricoes/horario/ultima', AdminConfigController.getUltimaRestricaoRegistrada);

module.exports = router;
