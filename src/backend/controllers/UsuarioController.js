const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs'); // <--- ADICIONE ESTA LINHA

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
            const { id, nome, email, setor, abvsetor, admin, senha } = req.body;
            
            if (!id) {
                return res.status(400).json({ error: "Número USP (id) é obrigatório" });
            }

            // --- CORREÇÃO AQUI: CRIPTOGRAFAR A SENHA ---
            let senhaFinal = senha;
            if (senha) {
                const saltRounds = 12;
                senhaFinal = await bcrypt.hash(senha, saltRounds);
            } else {
                // Se não enviar senha, cria uma temporária aleatória para não deixar vazio
                senhaFinal = await bcrypt.hash('temp' + Date.now(), 12);
            }
            // -------------------------------------------

            const novoUsuario = await Usuario.create({
                id, 
                nome,
                email,
                setor: setor,
                abvsetor: abvsetor || 'ND',
                senha: senhaFinal, // Salva o HASH e não o texto puro
                admin: admin || 0
            });
            
            // Remove a senha do objeto de retorno por segurança
            const resultado = novoUsuario.get();
            delete resultado.senha;

            res.status(201).json(resultado);
        } catch (error) {
            console.error('Erro detalhado:', error);
            res.status(500).json({ 
                error: 'Erro ao adicionar usuário',
                detalhes: error.message 
            });
        }
    },

    // Atualizar usuário
    async atualizarUsuario(req, res) {
        try {
            const { id } = req.params; 
            const { id: novoId, nome, email, setor, abvsetor, admin, senha } = req.body;
            
            const usuario = await Usuario.findOne({ where: { id: id } });
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            const dadosAtualizados = {
                id: novoId || usuario.id, 
                nome: nome || usuario.nome,
                email: email || usuario.email,
                setor: setor || usuario.setor,
                abvsetor: abvsetor !== undefined ? abvsetor : usuario.abvsetor,
                admin: admin !== undefined ? admin : usuario.admin
            };

            // Se uma nova senha for enviada na atualização, criptografa ela também
            if (senha) {
                dadosAtualizados.senha = await bcrypt.hash(senha, 12);
            }
            
            await usuario.update(dadosAtualizados);
            
            const usuarioAtualizado = usuario.get();
            delete usuarioAtualizado.senha;
            
            res.json(usuarioAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    },

    // Obter usuário por ID
    async obterUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findOne({ where: { id: id } });
            if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
            
            const dados = usuario.get();
            delete dados.senha;
            res.json(dados);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter usuário' });
        }
    },

    // Remover usuário
    async removerUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findOne({ where: { id: id } });
            if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
            
            await usuario.destroy();
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover usuário' });
        }
    }
};

module.exports = UsuarioController;