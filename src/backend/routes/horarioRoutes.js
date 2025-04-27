// horarioRoutes.js
const express = require("express");
const router = express.Router();
const {
  adicionarHorario,
  removerHorario,
  salvarHorario,
  configurarHorario
} = require("../controllers/horarioController");

router.post("/adicionar-horario", adicionarHorario);
router.delete("/remover-horario/:id", removerHorario);
router.post("/salvar-horario", salvarHorario);
router.post("/configurar-horario", configurarHorario);

module.exports = router;