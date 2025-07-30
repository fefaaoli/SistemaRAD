// routes/admin/periodo.js
const express = require('express');
const router = express.Router();
const PeriodoController = require('../controllers/PeriodoController');

router.post('/', PeriodoController.criarPeriodo);
module.exports = router;