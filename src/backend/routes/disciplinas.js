// routes/disciplina.js
const express = require('express');
const router = express.Router();
const DisciplinaController = require('../controllers/DisciplinaController');

// Catálogo completo
router.get('/', DisciplinaController.listarTodas);

// CRUD Disciplinas
router.post('/', DisciplinaController.criar);
router.put('/:id', DisciplinaController.atualizarDisciplina);

// Gerenciamento por período
router.post('/:periodo/ativar/:id', DisciplinaController.ativarParaPeriodo);
router.delete('/:periodo/desativar/:id', DisciplinaController.desativarParaPeriodo);
router.get('/ativas', DisciplinaController.listarAtivas);

module.exports = router;