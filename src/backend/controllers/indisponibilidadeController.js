const ExpRestricao = require('../models/ExpRestricao');
const { QueryTypes } = require('sequelize');
const sequelize = require('../database');

// Função para pegar o último período cadastrado
async function getUltimoPeriodo() {
  const resultado = await sequelize.query(
    "SELECT periodo FROM exp_horario ORDER BY CAST(periodo AS UNSIGNED) DESC LIMIT 1",
    { type: QueryTypes.SELECT }
  );

  return resultado.length > 0 ? resultado[0].periodo : null;
}

module.exports = {
  // Criar nova restrição
  async createRestricao(req, res) {
    try {
      const { docente, hordem, dordem } = req.body;
      const periodo = await getUltimoPeriodo();

      if (!periodo) {
        return res.status(400).json({ error: 'Nenhum período cadastrado.' });
      }

      // validação: não permitir duplicadas
      const existente = await ExpRestricao.findOne({
        where: { docente, periodo, hordem, dordem }
      });

      if (existente) {
        return res.status(400).json({ error: 'Restrição já cadastrada.' });
      }

      const restricao = await ExpRestricao.create({
        docente,
        periodo,
        hordem,
        dordem
      });

      res.status(201).json(restricao);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar restrição.' });
    }
  },

  // Substitui todas as restrições antigas pelas novas
  async substituirRestricoes(req, res) {
    const t = await sequelize.transaction(); // Inicia transação

    try {
      const { docente, restricoes } = req.body; 
      // 'restricoes' deve ser um array de objetos: [{ hordem: 1, dordem: 1 }, ...]
      
      const periodo = await getUltimoPeriodo();

      if (!periodo) {
        await t.rollback();
        return res.status(400).json({ error: 'Nenhum período cadastrado.' });
      }

      // 1. Deleta TODAS as restrições desse docente neste período
      await ExpRestricao.destroy({
        where: { docente, periodo },
        transaction: t
      });

      // 2. Prepara os dados para inserção em massa
      if (restricoes && restricoes.length > 0) {
        const dadosParaInserir = restricoes.map(r => ({
          docente,
          periodo,
          hordem: r.hordem,
          dordem: r.dordem
        }));

        // 3. Insere os novos
        await ExpRestricao.bulkCreate(dadosParaInserir, { transaction: t });
      }

      await t.commit(); // Confirma as alterações no banco
      res.status(200).json({ message: 'Restrições atualizadas com sucesso.' });

    } catch (err) {
      await t.rollback(); // Desfaz tudo se der erro
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar restrições.' });
    }
  },
  
  // Substitui todas as restrições antigas pelas novas
  async substituirRestricoes(req, res) {
    const t = await sequelize.transaction(); // Inicia transação

    try {
      const { docente, restricoes } = req.body; 
      // 'restricoes' deve ser um array de objetos: [{ hordem: 1, dordem: 1 }, ...]
      
      const periodo = await getUltimoPeriodo();

      if (!periodo) {
        await t.rollback();
        return res.status(400).json({ error: 'Nenhum período cadastrado.' });
      }

      // 1. Deleta TODAS as restrições desse docente neste período
      await ExpRestricao.destroy({
        where: { docente, periodo },
        transaction: t
      });

      // 2. Prepara os dados para inserção em massa
      if (restricoes && restricoes.length > 0) {
        const dadosParaInserir = restricoes.map(r => ({
          docente,
          periodo,
          hordem: r.hordem,
          dordem: r.dordem
        }));

        // 3. Insere os novos
        await ExpRestricao.bulkCreate(dadosParaInserir, { transaction: t });
      }

      await t.commit(); // Confirma as alterações no banco
      res.status(200).json({ message: 'Restrições atualizadas com sucesso.' });

    } catch (err) {
      await t.rollback(); // Desfaz tudo se der erro
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar restrições.' });
    }
  },

  // Listar restrições de um docente no período atual
  async getRestricoesByDocente(req, res) {
    try {
      const { docente } = req.params;
      const periodo = await getUltimoPeriodo();

      const restricoes = await ExpRestricao.findAll({
        where: { docente, periodo }
      });

      res.json(restricoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar restrições.' });
    }
  },

  // Remover restrição
  async deleteRestricao(req, res) {
    try {
      const { docente, hordem, dordem } = req.body;
      const periodo = await getUltimoPeriodo();

      const deletado = await ExpRestricao.destroy({
        where: { docente, periodo, hordem, dordem }
      });

      if (!deletado) {
        return res.status(404).json({ error: 'Restrição não encontrada.' });
      }

      res.json({ message: 'Restrição removida com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao remover restrição.' });
    }
  }
};
