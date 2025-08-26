const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const authController = {
    // Login
    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            // Validação básica
            if (!email || !senha) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }

            // Buscar usuário
            const usuario = await Usuario.findOne({ where: { email } });
            
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            
            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Gerar token JWT
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    email: usuario.email,
                    admin: usuario.admin 
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retornar dados do usuário (sem a senha) e token
            res.json({
                message: 'Login realizado com sucesso!',
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    setor: usuario.setor,
                    admin: usuario.admin
                }
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    // Logout (client-side, mas podemos invalidar tokens se quiser)
    logout: (req, res) => {
        // Como JWT é stateless, o logout é feito no client-side
        // removendo o token do localStorage/sessionStorage
        res.json({ message: 'Logout realizado com sucesso.' });
    },

    // Verificar token (útil para verificar se o usuário ainda está logado)
    verify: async (req, res) => {
        try {
            // Se o middleware authMiddleware passou, o usuário está autenticado
            res.json({
                usuario: {
                    id: req.usuario.id,
                    nome: req.usuario.nome,
                    email: req.usuario.email,
                    setor: req.usuario.setor,
                    admin: req.usuario.admin
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao verificar token.' });
        }
    },

    // Rota para definir senha inicial 
    definirSenha: async (req, res) => {
        try {
            const { id, novaSenha } = req.body;
            
            // Verificar se é admin ou o próprio usuário
            if (req.usuario.id !== parseInt(id) && req.usuario.admin !== 1) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            const saltRounds = 12;
            const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

            await Usuario.update(
                { senha: senhaHash },
                { where: { id } }
            );

            res.json({ message: 'Senha definida com sucesso.' });
        } catch (error) {
            console.error('Erro ao definir senha:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
};

module.exports = authController;