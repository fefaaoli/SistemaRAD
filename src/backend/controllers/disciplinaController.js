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

  // Selecionar Disciplinas Para o Período
  selecionarDisciplinasParaPeriodo: async (req, res) => {
    try {
      console.log('Iniciando seleção de disciplinas...'); // Debug
      
      const { disciplinasIds } = req.body;
      console.log('IDs recebidos:', disciplinasIds); // Debug

      // 1. Busca o último período com mais logs
      const ultimoPeriodo = await database.query(
        `SELECT periodo FROM exp_horario 
        WHERE cat = 'init' AND ordem = 0 
        ORDER BY 
          CAST(SUBSTRING(periodo, 1, 4) AS UNSIGNED) DESC,
          CASE WHEN SUBSTRING(periodo, 6, 1) = '1' THEN 1 ELSE 2 END DESC 
        LIMIT 1`,
        { type: database.QueryTypes.SELECT }
      );

      console.log('Último período encontrado:', ultimoPeriodo); // Debug

      if (!ultimoPeriodo || ultimoPeriodo.length === 0) {
        console.error('Nenhum período encontrado!'); // Debug
        return res.status(404).json({
          error: 'Nenhum período cadastrado no sistema',
          code: 'PERIODO_NAO_ENCONTRADO'
        });
      }

      const periodo = ultimoPeriodo[0].periodo;
      console.log('Período que será usado:', periodo); // Debug

      // 2. Validação das disciplinas
      if (!Array.isArray(disciplinasIds)) {
        console.error('IDs não são um array:', disciplinasIds); // Debug
        return res.status(400).json({
          error: 'Formato inválido. Envie um array de IDs de disciplinas',
          code: 'FORMATO_INVALIDO'
        });
      }

      // 3. Verifica disciplinas existentes
      console.log('Verificando disciplinas no banco...'); // Debug
      const disciplinasExistentes = await Disciplina.findAll({ 
        where: { id: disciplinasIds } 
      });

      if (disciplinasExistentes.length !== disciplinasIds.length) {
        const idsInvalidos = disciplinasIds.filter(id => 
          !disciplinasExistentes.some(d => d.id === id)
        );
        console.error('IDs inválidos encontrados:', idsInvalidos); // Debug
        return res.status(404).json({
          error: 'Disciplinas não encontradas',
          idsInvalidos,
          code: 'DISCIPLINAS_INVALIDAS'
        });
      }

      // 4. Processamento em transação com mais logs
      console.log('Iniciando transação...'); // Debug
      const resultado = await database.transaction(async (t) => {
        console.log(`Removendo ofertas existentes para ${periodo}...`); // Debug
        const deleteCount = await ExpOferecimento.destroy({ 
          where: { periodo }, 
          transaction: t 
        });
        console.log(`Removidas ${deleteCount} ofertas antigas`); // Debug
        
        console.log('Criando novas ofertas...'); // Debug
        const novasOfertas = await ExpOferecimento.bulkCreate(
          disciplinasIds.map(id => ({ periodo, aid: id })), 
          { transaction: t, returning: true }
        );
        console.log(`Criadas ${novasOfertas.length} novas ofertas`); // Debug

        return { 
          success: true,
          periodoUtilizado: periodo,
          totalDisciplinas: disciplinasIds.length,
          deleted: deleteCount,
          created: novasOfertas.length,
          updatedAt: new Date()
        };
      });

      console.log('Transação concluída com sucesso:', resultado); // Debug
      res.json(resultado);

    } catch (err) {
      console.error('Erro detalhado:', err); // Debug mais completo
      res.status(500).json({
        error: 'Erro no servidor ao processar vínculo de disciplinas',
        code: 'ERRO_INTERNO',
        details: process.env.NODE_ENV === 'development' ? {
          message: err.message,
          stack: err.stack,
          sql: err.sql
        } : undefined
      });
    }
  },

  // Listar Disciplinas Ativas
  listarDisciplinasAtivas: async (req, res) => {
    try {
      // Busca o último período que realmente tem ofertas cadastradas
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
      console.log('Período ativo encontrado:', periodo);

      // Query alternativa usando JOIN explícito
      const disciplinas = await database.query(
        `SELECT d.id, d.cod, d.disciplina as nome, d.cred, d.turma, d.tipo 
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
      
      // Verifica se a disciplina existe
      const disciplina = await Disciplina.findByPk(id);
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      
      // Verifica se há ofertas vinculadas a esta disciplina
      const ofertasVinculadas = await ExpOferecimento.count({
        where: { aid: id }
      });
      
      if (ofertasVinculadas > 0) {
        return res.status(400).json({
          error: 'Não é possível remover a disciplina pois existem ofertas vinculadas',
          code: 'OFERTAS_VINCULADAS'
        });
      }
      
      // Remove a disciplina
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