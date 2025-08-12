// routes/disciplina.js
const express = require('express');
const router = express.Router();
const DisciplinaController = require('../controllers/DisciplinaController');

// Catálogo completo
router.get('/', DisciplinaController.listarTodas);

// CRUD Disciplinas
router.post('/', DisciplinaController.criar);
router.put('/:id', DisciplinaController.atualizarDisciplina);
router.delete('/:id', DisciplinaController.removerDisciplina); 

// Gerenciamento por período
router.get('/ativas', DisciplinaController.listarDisciplinasAtivas);
router.post('/selecionar', DisciplinaController.selecionarDisciplinasParaPeriodo);

module.exports = router;