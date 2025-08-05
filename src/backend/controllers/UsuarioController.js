const Usuario = require('../models/Usuario');

const UsuarioController = {
    // Listar todos os usuários
    async listarUsuarios(req, res) {
        try {
            const usuarios = await Usuario.findAll({
                order: [['nome', 'ASC']]
            });
            res.json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    },

    // Adicionar novo usuário
    async adicionarUsuario(req, res) {
        try {
            const { id, nome, email, setor, abvsetor, admin } = req.body;
            
            if (!id) {
                return res.status(400).json({ error: "Número USP (id) é obrigatório" });
            }

            const novoUsuario = await Usuario.create({
                id, 
                nome,
                email,
                setor,
                abvsetor: req.body.abvsetor || 'ND',
                senha: req.body.senha,
                admin: admin || 0
            });
            
            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error('Erro detalhado:', error);
            res.status(500).json({ 
                error: 'Erro ao adicionar usuário',
                detalhes: error.message // Mostra o erro específico
            });
        }
    },

    // Atualizar usuário
    async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, setor, abvsetor, admin } = req.body;
            
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            // Mantém valores existentes para campos não enviados
            const dadosAtualizados = {
                nome: nome || usuario.nome,
                email: email || usuario.email,
                setor: setor || usuario.setor,
                abvsetor: abvsetor !== undefined ? abvsetor : usuario.abvsetor, // Só atualiza se for enviado
                admin: admin !== undefined ? admin : usuario.admin
            };
            
            await usuario.update(dadosAtualizados);
            
            // Remove a senha do objeto de retorno
            const usuarioAtualizado = usuario.get();
            delete usuarioAtualizado.senha;
            
            res.json(usuarioAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ 
                    error: 'Dados inválidos',
                    erros: error.errors.map(err => err.message)
                });
            }
            
            res.status(500).json({ 
                error: 'Erro ao atualizar usuário',
                detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Obter usuário por ID (opcional, se precisar para o frontend)
    async obterUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            res.json(usuario);
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            res.status(500).json({ error: 'Erro ao obter usuário' });
        }
    }
};

module.exports = UsuarioController;