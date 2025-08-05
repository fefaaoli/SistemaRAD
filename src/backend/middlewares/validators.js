const { check } = require('express-validator');

exports.validateDisciplina = [
  check('cod')
    .notEmpty().withMessage('Código é obrigatório')
    .isLength({ max: 10 }).withMessage('Máximo 10 caracteres'),
  check('disciplina')
    .notEmpty().withMessage('Nome da disciplina é obrigatório')
    .isLength({ max: 60 }).withMessage('Máximo 60 caracteres'),
  check('tipo')
    .isIn(['Obrigatória', 'Optativa Eletiva', 'Optativa Livre']).withMessage('Tipo inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];