const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');  
const { verificarToken, verificarAdmin } = require('../controllers/authController');

// Rota para criar uma nova disciplina (apenas admins podem acessar)
router.post('/disciplinas', verificarToken, verificarAdmin, disciplinaController.criarDisciplina);

// Rota para listar todas as disciplinas
router.get('/disciplinas', verificarToken, disciplinaController.listarDisciplinas);

// Rota para atualizar uma disciplina existente (apenas admins podem acessar)
router.put('/disciplinas/:id', verificarToken, verificarAdmin, disciplinaController.atualizarDisciplina);

// Rota para remover uma disciplina (apenas admins podem acessar)
router.delete('/disciplinas/:id', verificarToken, verificarAdmin, disciplinaController.removerDisciplina);

// Rota para salvar disciplinas selecionadas para o semestre
router.post('/disciplinas/selecionar', verificarToken, verificarAdmin, disciplinaController.definirDisciplinasDoSemestre);

// Rota para listar as disciplinas disponíveis para o semestre
router.get('/disciplinas/selecionadas', verificarToken, disciplinaController.listarDisciplinasDoSemestre);

module.exports = router;
