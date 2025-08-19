// routes/restricaoRoutes.js
const express = require('express');
const router = express.Router();
const indisponibilidadeController = require('../controllers/indisponibilidadeController');

// Criar restrição
router.post('/', indisponibilidadeController.createRestricao);

// Listar restrições de um docente
router.get('/:docente', indisponibilidadeController.getRestricoesByDocente);

// Remover restrição
router.delete('/', indisponibilidadeController.deleteRestricao);

module.exports = router;
