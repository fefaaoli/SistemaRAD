const Config = require('../models/Config'); 
const Horario = require('../models/Horario'); 
const { QueryTypes } = require('sequelize');
const db = require('../database');

class AdminConfigController {

  static async getRestricao(req, res) {
    try {
      // Busca o período mais recente
      const periodoResult = await db.query(
        'SELECT periodo FROM exp_horario ORDER BY periodo DESC LIMIT 1',
        { type: QueryTypes.SELECT }
      );

      if (periodoResult.length === 0) {
        return res.status(404).json({ error: 'Nenhum período cadastrado' });
      }

      const periodo = periodoResult[0].periodo;

      // Busca configuração de restrição
      const config = await Config.findOne({ where: { nome: 'restricao' } });
      const restricao = config ? parseInt(config.valor) : 15;

      // Conta número de dias no período
      const dias = await Horario.count({ where: { periodo, cat: 'dia' } });

      // Conta número de horários por dia
      const horarios = await Horario.count({ where: { periodo, cat: 'hora' } });

      // Total de horários = dias * horários
      const totalHorarios = dias * horarios;

      const maxIndisponiveis = Math.max(0, totalHorarios - restricao);

      res.json({
        periodo,
        restricao,
        totalHorarios,
        maxIndisponiveis
      });

    } catch (error) {
      console.error('Erro no getRestricao:', error);
      res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
  }

  static async updateRestricao(req, res) {
    let { restricao } = req.body;

    if (restricao === undefined || isNaN(restricao)) {
      return res.status(400).json({ error: 'Campo restricao é obrigatório e deve ser um número' });
    }

    try {
      const config = await Config.findOne({ where: { nome: 'restricao' } });

      if (config) {
        config.valor = restricao.toString();
        await config.save();
      } else {
        await Config.create({ nome: 'restricao', valor: restricao.toString() });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Erro no updateRestricao:', error);
      res.status(500).json({ error: 'Erro ao atualizar configuração' });
    }
  }

  static async getUltimaRestricaoRegistrada(req, res) {
    try {
      const config = await Config.findOne({
        where: { nome: 'restricao' },
        order: [['createdAt', 'DESC']] // Pega a última registrada
      });

      if (!config) {
        return res.status(404).json({ error: 'Nenhuma restrição registrada' });
      }

      res.json({
        valor: parseInt(config.valor),
        dataRegistro: config.createdAt
      });
    } catch (error) {
      console.error('Erro no getUltimaRestricaoRegistrada:', error);
      res.status(500).json({ error: 'Erro ao buscar última restrição' });
    }
  }
}

module.exports = AdminConfigController;
