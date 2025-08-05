const Horario = require('../models/Horario');
const sequelize = require('../database');
const { Op } = require('sequelize');

exports.getHorariosByPeriodo = async (req, res) => {
  try {
    const periodo = req.params.periodo.replace('-', '/');

    const horarios = await Horario.findAll({
      where: { 
        periodo,
        cat: 'hora' // Alterado para maiúsculo para consistência
      },
      order: [['ordem', 'ASC']],
      attributes: ['valor']
    });

    const dias = await Horario.findAll({
      where: { 
        periodo,
        cat: 'dia' // Alterado para maiúsculo para consistência
      },
      order: [['ordem', 'ASC']],
      attributes: ['valor']
    });

    res.json({
      horarios: horarios.map(h => h.valor),
      dias: dias.map(d => d.valor)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHorarios = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { periodo } = req.params;
    const periodoFormatado = periodo.replace('-', '/');
    const { horarios, horariosParaRemover } = req.body;

    // Validação básica
    if ((!horarios || horarios.length === 0) && (!horariosParaRemover || horariosParaRemover.length === 0)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Nenhum horário para adicionar ou remover foi enviado.' });
    }

    // Validação de formato
    const formatoValido = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] às ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (horarios && horarios.some(h => !formatoValido.test(h))) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Formato de horário inválido. Use "HH:MM às HH:MM".' });
    }

    if (horariosParaRemover && horariosParaRemover.some(h => !formatoValido.test(h))) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Formato de horário inválido para remoção. Use "HH:MM às HH:MM".' });
    }

    // Remoção de horários
    if (horariosParaRemover && horariosParaRemover.length > 0) {
      await Horario.destroy({
        where: {
          periodo: periodoFormatado,
          cat: 'HORA',
          valor: { [Op.in]: horariosParaRemover }
        },
        transaction
      });
    }

    // Adição de novos horários
    if (horarios && horarios.length > 0) {
      // Verifica duplicatas
      const existentes = await Horario.findAll({
        where: {
          periodo: periodoFormatado,
          cat: 'HORA',
          valor: { [Op.in]: horarios }
        },
        transaction
      });

      if (existentes.length > 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'Alguns horários já existem no sistema.',
          horariosDuplicados: existentes.map(h => h.valor)
        });
      }

      // Encontra a última ordem
      const ultimaOrdem = await Horario.max('ordem', {
        where: { periodo: periodoFormatado, cat: 'HORA' },
        transaction
      }) || 0;

      // Prepara e insere novos horários
      const novosHorarios = horarios.map((valor, index) => ({
        periodo: periodoFormatado,
        ordem: ultimaOrdem + (index + 1) * 10,
        cat: 'HORA',
        valor
      }));

      await Horario.bulkCreate(novosHorarios, { transaction });
    }

    await transaction.commit();
    res.json({ 
      message: 'Operação concluída com sucesso.',
      horariosAdicionados: horarios || [],
      horariosRemovidos: horariosParaRemover || []
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      error: 'Falha ao processar a solicitação.',
      detalhes: error.message
    });
  }
};