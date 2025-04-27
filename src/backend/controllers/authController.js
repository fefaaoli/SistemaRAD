const jwt = require('jsonwebtoken');

const segredoJWT = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], segredoJWT);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

function verificarAdmin(req, res, next) {
  if (req.user?.admin === 1) {
    return next();
  }
  return res.status(403).json({ error: 'Acesso negado: Usuário não é admin' });
}


function verificarDocente(req, res, next) {
  if (req.user && req.user.admin === 0) {
    return next();
  } else {
    return res.status(403).json({ error: 'Acesso negado: Usuário não é docente' });
  }
}

module.exports = { verificarToken, verificarAdmin, verificarDocente };


  