// routes/restricoesRoutes.js
const express = require('express');
const router = express.Router();
const restricoesController = require('../controllers/restricoesController');

router.post('/configurar', restricoesController.configurarRestricoes);

module.exports = router;