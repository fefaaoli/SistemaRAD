const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.get('/:periodo', horarioController.getHorariosByPeriodo);
router.put('/:periodo', horarioController.updateHorarios);

module.exports = router;