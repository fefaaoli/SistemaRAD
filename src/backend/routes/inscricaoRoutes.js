const express = require('express');
const router = express.Router();
const InscricaoController = require('../controllers/InscricaoController');

router.post('/add', InscricaoController.add);
router.delete('/remove', InscricaoController.remove);
router.get('/list/:did', InscricaoController.list);
router.post('/comentario', InscricaoController.addComentario);
router.get('/comentarios/:did', InscricaoController.getComentarios);

module.exports = router;
