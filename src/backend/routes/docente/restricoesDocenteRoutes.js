const express = require('express');
const router = express.Router();
const controller = require('../../controllers/restricaoController');

// Docente cadastra indisponibilidades
router.post('/', controller.definirIndisponibilidades);

module.exports = router;