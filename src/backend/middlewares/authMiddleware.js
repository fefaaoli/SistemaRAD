const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); 

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui';

// Middleware para verificar o token JWT
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);
        
        if (!usuario) {
            return res.status(401).json({ message: 'Token inválido.' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
    if (req.usuario && req.usuario.admin === 1) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }
};

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };