const { Op } = require("sequelize");
const { Disciplina } = require('../models/disciplinaModel'); 
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/disciplinasSelecionadas.json');

// Função para carregar as disciplinas selecionadas
const carregarDisciplinasSelecionadas = () => {
    try {
        if (!fs.existsSync(filePath)) return { disciplinas: [] };  // Retorna array vazio se o arquivo não existir
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao carregar disciplinas selecionadas:", error);
        return { disciplinas: [] };
    }
};

// Função para salvar as disciplinas selecionadas
const salvarDisciplinasSelecionadas = (disciplinasIds) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify({ disciplinas: disciplinasIds }, null, 2));
    } catch (error) {
        console.error("Erro ao salvar disciplinas selecionadas:", error);
    }
};

// Listar e buscar disciplinas com filtros
const listarDisciplinas = async (req, res) => {
    try {
        const { cod, disciplina, turma, tipo } = req.query;

        const whereClause = {}; // Objeto para armazenar os filtros

        if (cod) {
            whereClause.cod = { [Op.like]: `%${cod}%` }; // Busca parcial por código
        }
        if (disciplina) {
            whereClause.disciplina = { [Op.like]: `%${disciplina}%` }; // Busca parcial por nome
        }
        if (turma) {
            whereClause.turma = turma; // Busca exata pela turma
        }
        if (tipo) {
            whereClause.tipo = tipo; // Busca exata pelo tipo
        }

        const disciplinas = await Disciplina.findAll({ where: whereClause });

        return res.json(disciplinas);
    } catch (error) {
        console.error("Erro ao listar disciplinas:", error);
        return res.status(500).json({ mensagem: "Erro ao listar disciplinas." });
    }
};

// Criar uma nova disciplina
const criarDisciplina = async (req, res) => {
    try {
        const disciplina = await Disciplina.create(req.body);
        return res.status(201).json({ mensagem: "Disciplina criada com sucesso!", disciplina });
    } catch (error) {
        console.error("Erro ao criar disciplina:", error);
        return res.status(500).json({ mensagem: "Erro ao criar disciplina." });
    }
};

// Atualizar disciplina por ID
const atualizarDisciplina = async (req, res) => {
    try {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);
        
        if (!disciplina) {
            return res.status(404).json({ mensagem: "Disciplina não encontrada." });
        }

        await disciplina.update(req.body);
        return res.status(200).json({ mensagem: "Disciplina atualizada com sucesso!", disciplina });
    } catch (error) {
        console.error("Erro ao atualizar disciplina:", error);
        return res.status(500).json({ mensagem: "Erro ao atualizar disciplina." });
    }
};

// Remover disciplina por ID
const removerDisciplina = async (req, res) => {
    try {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);
        
        if (!disciplina) {
            return res.status(404).json({ mensagem: "Disciplina não encontrada." });
        }

        await disciplina.destroy();
        return res.status(200).json({ mensagem: "Disciplina removida com sucesso!" });
    } catch (error) {
        console.error("Erro ao remover disciplina:", error);
        return res.status(500).json({ mensagem: "Erro ao remover disciplina." });
    }
};

// Função para definir as disciplinas disponíveis para o semestre
const definirDisciplinasDoSemestre = async (req, res) => {
    try {
        const { disciplinasIds } = req.body; // IDs das disciplinas escolhidas pelo admin

        // Salvamos a seleção em um arquivo JSON
        salvarDisciplinasSelecionadas(disciplinasIds);

        return res.status(200).json({ mensagem: "Disciplinas do semestre salvas com sucesso!" });
    } catch (error) {
        console.error("Erro ao definir disciplinas do semestre:", error);
        return res.status(500).json({ mensagem: "Erro ao salvar disciplinas do semestre." });
    }
};

// Listar as disciplinas disponíveis para o semestre
const listarDisciplinasDoSemestre = async (req, res) => {
    try {
        const { disciplinas } = carregarDisciplinasSelecionadas();

        // Buscar apenas as disciplinas selecionadas
        const disciplinasFiltradas = await Disciplina.findAll({ where: { id: disciplinas } });

        return res.status(200).json(disciplinasFiltradas);
    } catch (error) {
        console.error("Erro ao listar disciplinas do semestre:", error);
        return res.status(500).json({ mensagem: "Erro ao buscar disciplinas do semestre." });
    }
};

module.exports = {
    listarDisciplinas,
    criarDisciplina,
    atualizarDisciplina,
    removerDisciplina,
    definirDisciplinasDoSemestre,
    listarDisciplinasDoSemestre
};
