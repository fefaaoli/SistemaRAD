const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');
const { Op } = require('sequelize');

const segredoJWT = process.env.JWT_SECRET; // Obtém o segredo do JWT de uma variável de ambiente

async function login(req, res) {
  const { login, senha } = req.body;

  // Busca o usuário pelo ID ou email
  const usuario = await Usuario.findOne({
    where: {
      [Op.or]: [{ id: login }, { email: login }],
    },
  });

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Compara a senha fornecida com a armazenada no banco de dados (hash)
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (senhaCorreta) {
    // Gera o token JWT com tempo de expiração de 2 horas
    const token = jwt.sign(
      { id: usuario.id, admin: usuario.admin },
      segredoJWT,
      { expiresIn: '2h' }
    );

    return res.json({ message: 'Login bem-sucedido', token });
  } else {
    return res.status(400).json({ error: 'Senha incorreta' });
  }
}

module.exports = { login };



