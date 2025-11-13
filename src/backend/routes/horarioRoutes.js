const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

// Listar períodos disponíveis
router.get('/periodo-recente', horarioController.getPeriodoMaisRecente);

// Listar todos os períodos
router.get('/periodos', horarioController.getAllPeriodos); 

// Listar horários de um período
router.get('/', horarioController.getHorariosPorPeriodo);

// Salvar (adicionar/atualizar) lista de horários para um período
router.post('/salvar', horarioController.salvarHorarios);

// Remover horário específico
router.delete('/:periodo/:ordem', horarioController.removerHorario);

module.exports = router;
