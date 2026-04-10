const database = require('../database');
const { DataTypes, Op } = require('sequelize');

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
        order: [['disciplina', 'ASC']]
      });
      res.json(disciplinas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Criar nova disciplina
  async criar(req, res) {
    try {
      const { cod, disciplina, cred, turma, turno, tipo, comentario } = req.body;

      // 🔥 Validação
      if (!turno) {
        return res.status(400).json({ error: 'O campo turno é obrigatório' });
      }

      const novaDisciplina = await Disciplina.create({
        cod,
        disciplina,
        cred,
        turma,
        turno, // 👈 NOVO CAMPO
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

      const camposPermitidos = [
        'cod',
        'disciplina',
        'cred',
        'turma',
        'turno', // 👈 NOVO
        'tipo',
        'comentario'
      ];

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

  // Selecionar Disciplinas Para o Período
  selecionarDisciplinasParaPeriodo: async (req, res) => {
    try {
      console.log('Iniciando seleção de disciplinas...');

      const { disciplinasIds } = req.body;
      console.log('IDs recebidos:', disciplinasIds);

      const ultimoPeriodo = await database.query(
        `SELECT periodo FROM exp_horario 
        WHERE cat = 'init' AND ordem = 0 
        ORDER BY 
          CAST(SUBSTRING(periodo, 1, 4) AS UNSIGNED) DESC,
          CASE WHEN SUBSTRING(periodo, 6, 1) = '1' THEN 1 ELSE 2 END DESC 
        LIMIT 1`,
        { type: database.QueryTypes.SELECT }
      );

      if (!ultimoPeriodo || ultimoPeriodo.length === 0) {
        return res.status(404).json({
          error: 'Nenhum período cadastrado no sistema',
          code: 'PERIODO_NAO_ENCONTRADO'
        });
      }

      const periodo = ultimoPeriodo[0].periodo;

      if (!Array.isArray(disciplinasIds)) {
        return res.status(400).json({
          error: 'Formato inválido. Envie um array de IDs de disciplinas',
          code: 'FORMATO_INVALIDO'
        });
      }

      const disciplinasExistentes = await Disciplina.findAll({
        where: { id: disciplinasIds }
      });

      if (disciplinasExistentes.length !== disciplinasIds.length) {
        const idsInvalidos = disciplinasIds.filter(id =>
          !disciplinasExistentes.some(d => d.id === id)
        );

        return res.status(404).json({
          error: 'Disciplinas não encontradas',
          idsInvalidos,
          code: 'DISCIPLINAS_INVALIDAS'
        });
      }

      const resultado = await database.transaction(async (t) => {
        const deleteCount = await ExpOferecimento.destroy({
          where: { periodo },
          transaction: t
        });

        const novasOfertas = await ExpOferecimento.bulkCreate(
          disciplinasIds.map(id => ({ periodo, aid: id })),
          { transaction: t, returning: true }
        );

        return {
          success: true,
          periodoUtilizado: periodo,
          totalDisciplinas: disciplinasIds.length,
          deleted: deleteCount,
          created: novasOfertas.length,
          updatedAt: new Date()
        };
      });

      res.json(resultado);

    } catch (err) {
      console.error('Erro detalhado:', err);
      res.status(500).json({
        error: 'Erro no servidor ao processar vínculo de disciplinas',
        code: 'ERRO_INTERNO',
        details: process.env.NODE_ENV === 'development'
          ? {
              message: err.message,
              stack: err.stack,
              sql: err.sql
            }
          : undefined
      });
    }
  },

  // Listar Disciplinas Ativas
  listarDisciplinasAtivas: async (req, res) => {
    try {
      const periodoAtivo = await database.query(
        `SELECT periodo FROM exp_oferecimento 
        ORDER BY 
          CAST(SUBSTRING(periodo, 1, 4) AS UNSIGNED) DESC,
          CASE WHEN SUBSTRING(periodo, 6, 1) = '1' THEN 1 ELSE 2 END DESC 
        LIMIT 1`,
        { type: database.QueryTypes.SELECT }
      );

      if (!periodoAtivo || periodoAtivo.length === 0) {
        return res.json([]);
      }

      const periodo = periodoAtivo[0].periodo;

      const disciplinas = await database.query(
        `SELECT d.id, d.cod, d.disciplina as nome, d.cred, d.turma, d.turno, d.tipo 
        FROM exp_atividade d
        INNER JOIN exp_oferecimento o ON d.id = o.aid
        WHERE o.periodo = :periodo
        ORDER BY d.disciplina ASC`,
        {
          replacements: { periodo },
          type: database.QueryTypes.SELECT
        }
      );

      res.json(disciplinas);

    } catch (err) {
      console.error('Erro ao listar disciplinas ativas:', err);
      res.status(500).json({
        error: 'Erro ao carregar disciplinas ativas',
        details: err.message
      });
    }
  },

  // Remover disciplina
  async removerDisciplina(req, res) {
    try {
      const { id } = req.params;

      const disciplina = await Disciplina.findByPk(id);
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      const ofertasVinculadas = await ExpOferecimento.count({
        where: { aid: id }
      });

      if (ofertasVinculadas > 0) {
        return res.status(400).json({
          error: 'Não é possível remover a disciplina pois existem ofertas vinculadas',
          code: 'OFERTAS_VINCULADAS'
        });
      }

      await disciplina.destroy();

      res.json({
        success: true,
        message: 'Disciplina removida com sucesso',
        id: id
      });

    } catch (err) {
      res.status(500).json({
        error: 'Erro ao remover disciplina',
        details: err.message
      });
    }
  }

};