const Config = require('../models/Config');
const Restricao = require('../models/Restricao');
const Horario = require('../models/Horario');
const { Op } = require('sequelize');
const sequelize = require('../database'); // Adicione esta linha

module.exports = {
  // ADMIN: Atualiza o valor de 'restricao'
  configurarLimite: async (req, res) => {
    try {
      const { valor } = req.body;
      await Config.upsert({ 
        nome: 'restricao', 
        valor: valor.toString() 
      });
      res.json({ 
        success: true,
        restricao: parseInt(valor),
        limite_docente: Math.floor(valor / 3.75)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao configurar limite' });
    }
  },

  // DOCENTE: Define indisponibilidades
  definirIndisponibilidades: async (req, res) => {
    try {
      const { periodo, horarios } = req.body;
      const docenteId = req.user.id;
      const limiteGeral = await Config.getValor('restricao', 15);
      const limiteDocente = Math.floor(limiteGeral / 3.75);

      if (horarios.length > limiteDocente) {
        return res.status(400).json({
          error: `Máximo de ${limiteDocente} combinações permitidas`
        });
      }

      await sequelize.transaction(async (t) => {
        await Restricao.destroy({ 
          where: { docente: docenteId, periodo },
          transaction: t
        });

        await Restricao.bulkCreate(
          horarios.map(h => ({
            docente: docenteId,
            periodo,
            hordem: h.hordem,
            dordem: h.dordem
          })),
          { transaction: t }
        );
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao salvar indisponibilidades' });
    }
  },

  // ADMIN: Visualiza restrições
  listarRestricoes: async (req, res) => {
    try {
      const { periodo } = req.params;
      const restricoes = await Restricao.findAll({
        where: { periodo },
        include: ['docenteInfo']
      });
      res.json(restricoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar restrições' });
    }
  }
};