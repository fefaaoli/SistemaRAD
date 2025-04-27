// controllers/adminController.js
const { Usuario } = require('../models/usuarioModel'); 

// Função para cadastrar um novo usuário
const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, setor, abvsetor, admin } = req.body;

        // Verifica se todos os campos foram enviados
        if (!nome || !email || !setor || !abvsetor || admin === undefined) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
        }

        // Cria o novo usuário no banco de dados
        const novoUsuario = await Usuario.create({
            nome,
            email,
            setor,
            abvsetor,
            admin
        });

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao cadastrar o usuário." });
    }
};

// Função para editar um usuário existente
const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID do usuário da URL
        const { nome, email, setor, abvsetor, admin } = req.body; // Pega os dados a serem atualizados

        // Verifica se o usuário existe
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        // Atualiza os dados do usuário
        await usuario.update({ nome, email, setor, abvsetor, admin });

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!", usuario });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar o usuário." });
    }
};

// Função para remover um usuário
const removerUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID do usuário da URL

        // Verifica se o usuário existe
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        // Remove o usuário do banco de dados
        await usuario.destroy();

        return res.status(200).json({ mensagem: "Usuário removido com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao remover o usuário." });
    }
};

// Função criar período e insere automaticamente valores padrões de horário no banco de dados
const criarPeriodo = async (req, res) => {
    const { periodo } = req.body;

    try {
        // Busca o maior período no banco, convertendo corretamente para número decimal
        const [result] = await db.query('SELECT MAX(CAST(periodo AS DECIMAL(6,1))) AS maxPeriodo FROM exp_horario');
        const maxPeriodo = result[0]?.maxPeriodo || 0; // Se não houver período, assume 0

        // Se o período for maior que o atual, insere o novo período em exp_horario
        if (parseFloat(periodo) > parseFloat(maxPeriodo)) {
            await db.query('INSERT INTO exp_horario (periodo) VALUES (?)', [periodo]); 

            // Agora, insere os horários padrão em rr_horario
            const horarios = [
                ['2a feira', 'dia', 10],
                ['3a feira', 'dia', 20],
                ['4a feira', 'dia', 30],
                ['5a feira', 'dia', 40],
                ['6a feira', 'dia', 50],
                ['08:00 às 09:40', 'hora', 10],
                ['10:00 às 11:40', 'hora', 20],
                ['19:00 às 20:40', 'hora', 50],
                ['20:50 às 22:30', 'hora', 60]
            ];

            // Insere os horários na tabela rr_horario
            const promises = horarios.map(([valor, cat, ordem]) => 
                db.query('INSERT INTO rr_horario (periodo, ordem, cat, valor) VALUES (?, ?, ?, ?)', [periodo, ordem, cat, valor])
            );

            await Promise.all(promises); // Executa todas as inserções ao mesmo tempo

            return res.json({ success: true, message: "Período e horários criados com sucesso!" });
        } else {
            return res.status(400).json({ success: false, message: "Período já existe." });
        }
    } catch (error) {
        console.error("Erro ao criar período:", error);
        return res.status(500).json({ success: false, message: "Erro ao criar período.", error });
    }
};

  module.exports = {
      cadastrarUsuario,
      editarUsuario,
      removerUsuario,
      criarPeriodo
  };
  