const express = require('express');
const DocenteController = require('../controllers/docenteController');
const router = express.Router();

router.get('/', DocenteController.listarDocentes);
router.get('/:id/detalhes', DocenteController.obterDetalhesDocente);

module.exports = router;