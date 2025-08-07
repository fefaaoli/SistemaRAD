const db = require('../database');
const { QueryTypes } = require('sequelize');
const Horario = require('../models/Horario');

// GET - Listar todos os períodos disponíveis
exports.getPeriodoMaisRecente = async (req, res) => {
  try {
    const rows = await db.query(
      'SELECT periodo FROM exp_horario ORDER BY periodo DESC LIMIT 1',
      {
        type: QueryTypes.SELECT
      }
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum período cadastrado' });
    }
    
    res.json({ periodo: rows[0].periodo });
  } catch (error) {
    console.error('Erro ao buscar período mais recente:', error);
    res.status(500).json({ error: 'Erro interno ao buscar período' });
  }
};

// GET - Listar horários padrão por período
exports.getHorariosPorPeriodo = async (req, res) => {
  console.log('Query params:', req.query);   // <-- log de debug importante!
  const { periodo } = req.query;
  console.log('Período recebido na rota:', periodo);

  if (!periodo) {
    return res.status(400).json({ error: 'Parâmetro período é obrigatório' });
  }

  try {
    const rows = await db.query(
      'SELECT * FROM exp_horario WHERE periodo = ? ORDER BY ordem',
      {
        replacements: [periodo],
        type: QueryTypes.SELECT
      }
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: 'Erro interno ao buscar horários' });
  }
};

// POST - Adicionar ou atualizar horários padrão (recebe lista de horários para salvar no período)
exports.salvarHorarios = async (req, res) => {
  const { periodo, horarios } = req.body;
  // horarios é um array de objetos { ordem, cat, valor }

  if (!periodo || !Array.isArray(horarios)) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  try {
    // Remover horários atuais daquele período (resetar)
    await db.query('DELETE FROM exp_horario WHERE periodo = ?', {
      replacements: [periodo],
      type: QueryTypes.DELETE
    });

    // Inserir os novos horários
    const insertPromises = horarios.map(({ ordem, cat, valor }) => {
      return db.query(
        'INSERT INTO exp_horario (periodo, ordem, cat, valor) VALUES (?, ?, ?, ?)',
        {
          replacements: [periodo, ordem, cat, valor],
          type: QueryTypes.INSERT
        }
      );
    });
    await Promise.all(insertPromises);

    res.json({ message: 'Horários salvos com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar horários:', error);
    res.status(500).json({ error: 'Erro interno ao salvar horários' });
  }
};

// DELETE - Remover faixa horária específica pelo id composto
// Como a tabela não tem ID, podemos remover pelo período + ordem (único)
exports.removerHorario = async (req, res) => {
  const { periodo, ordem } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM exp_horario WHERE periodo = ? AND ordem = ?',
      {
        replacements: [periodo, ordem],
        type: QueryTypes.DELETE
      }
    );

    // Sequelize retorna um array, mas para DELETE não retorna affectedRows diretamente,
    // então, para garantir, podemos checar a resposta conforme seu banco
    // Se quiser, pode executar um SELECT para verificar existência após DELETE

    res.json({ message: 'Horário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover horário:', error);
    res.status(500).json({ error: 'Erro interno ao remover horário' });
  }
};
