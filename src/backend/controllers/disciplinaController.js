const database = require('../database');
const { DataTypes } = require('sequelize');

// Importa os modelos
const Disciplina = require('../models/Disciplina')(database, DataTypes);
const ExpOferecimento = require('../models/ExpOferecimento')(database, DataTypes);

// Associações
Disciplina.hasMany(ExpOferecimento, { foreignKey: 'aid' });
ExpOferecimento.belongsTo(Disciplina, { foreignKey: 'aid' });

module.exports = {
  // Listar todas as disciplinas (catálogo completo)
  async listarTodas(req, res) {
    try {
      const disciplinas = await Disciplina.findAll({
        order: [['disciplina', 'ASC']]  // Ordena pelo campo 'disciplina' (nome)
      });
      res.json(disciplinas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Criar nova disciplina
  async criar(req, res) {
    try {
      const { cod, disciplina, cred, turma, tipo, comentario } = req.body;
      
      const novaDisciplina = await Disciplina.create({
        cod,
        disciplina,  
        cred,        
        turma,
        tipo,
        comentario
      });
      
      res.status(201).json(novaDisciplina);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Atualizar disciplina
  async atualizarDisciplina(req, res) {
    try {
      const { id } = req.params;
      const disciplina = await Disciplina.findByPk(id);
      
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      
      // Filtra apenas os campos que existem na tabela
      const camposPermitidos = ['cod', 'disciplina', 'cred', 'turma', 'tipo', 'comentario'];
      const dadosAtualizacao = {};
      
      for (const campo of camposPermitidos) {
        if (req.body[campo] !== undefined) {
          dadosAtualizacao[campo] = req.body[campo];
        }
      }
      
      await disciplina.update(dadosAtualizacao);
      res.json(disciplina);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Ativar disciplina para um período
  async ativarParaPeriodo(req, res) {
    try {
      const { periodo, id } = req.params;
      
      const [oferecimento, created] = await ExpOferecimento.findOrCreate({
        where: { periodo, aid: id },
        defaults: { periodo, aid: id }
      });
      
      if (!created) {
        return res.status(409).json({ error: 'Disciplina já ativada para este período' });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Listar disciplinas ativas em um período
  async listarAtivas(req, res) {
    try {
      const { periodo, tipo } = req.query;
      
      const where = {};
      if (tipo) where.tipo = tipo;
      
      const disciplinas = await ExpOferecimento.findAll({
        where: { periodo },
        include: [{
          model: Disciplina,
          where,
          as: 'disciplina'
        }]
      });
      
      res.json(disciplinas.map(d => d.disciplina));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Desativar disciplina de um período
  async desativarParaPeriodo(req, res) {
    try {
      const { periodo, id } = req.params;
      
      const result = await ExpOferecimento.destroy({
        where: { periodo, aid: id }
      });
      
      if (result === 0) {
        return res.status(404).json({ error: 'Disciplina não estava ativa para este período' });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};