const sequelize = require('../database');
const { DataTypes } = require('sequelize');
const { addInscricao, removeInscricao, getInscricoesByDocente } = require('../models/InscricaoModel');
const InscricaoComentarioModel = require('../models/ComentarioModel')(sequelize, DataTypes);

class InscricaoController {
  static async getUltimoPeriodo() {
    const [result] = await sequelize.query(
      `SELECT periodo FROM exp_oferecimento ORDER BY periodo DESC LIMIT 1`
    );
    if (result.length === 0) throw new Error('Nenhum período disponível.');
    return result[0].periodo;
  }

  static async add(req, res) {
    const { aid, did } = req.body;
    try {
      const periodo = await InscricaoController.getUltimoPeriodo();
      await addInscricao(aid, did, periodo);
      res.status(201).json({ success: true, message: 'Disciplina adicionada!', periodo });
    } catch (error) {
        console.error("🚨 ERRO em /api/inscricao/add:", error); // <<< ADICIONADO
        res.status(500).json({ success: false, message: error.message || 'Erro ao adicionar disciplina' });
      }
  }

  static async remove(req, res) {
    const { aid, did } = req.body;
    try {
      const periodo = await InscricaoController.getUltimoPeriodo();
      await removeInscricao(aid, did, periodo);
      res.status(200).json({ success: true, message: 'Disciplina removida!', periodo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || 'Erro ao remover disciplina' });
    }
  }

  static async list(req, res) {
    const { did } = req.params;
    try {
      const periodo = await InscricaoController.getUltimoPeriodo();
      const inscricoes = await getInscricoesByDocente(did, periodo);
      res.status(200).json({ success: true, data: inscricoes, periodo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || 'Erro ao buscar inscrições' });
    }
  }

  // NOVAS FUNÇÕES PARA COMENTÁRIOS E METADADOS
  static async addComentario(req, res) {
    const { did, aid, comentario, idioma_en, apoio_leia, max_alunos } = req.body;

    try {
      const periodo = await InscricaoController.getUltimoPeriodo();

      // Validação max_alunos ≥ 30 se informado
      if (max_alunos !== undefined && max_alunos !== null && max_alunos < 30) {
        return res.status(400).json({ success: false, message: "O número mínimo de alunos em optativas é 30." });
      }

      // Inserir ou atualizar comentário
      await InscricaoComentarioModel.upsert({
        did,
        aid,
        periodo,
        comentario,
        idioma_en: idioma_en ? 1 : 0,
        apoio_leia: apoio_leia ? 1 : 0,
        max_alunos: max_alunos || null
      });

      res.status(201).json({ success: true, message: 'Comentário/metadados salvos com sucesso!', periodo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || 'Erro ao salvar comentário' });
    }
  }

  static async getComentarios(req, res) {
    const { did } = req.params;
    try {
      const periodo = await InscricaoController.getUltimoPeriodo();
      const comentarios = await InscricaoComentarioModel.findAll({
        where: { did, periodo }
      });
      res.status(200).json({ success: true, data: comentarios, periodo });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || 'Erro ao buscar comentários' });
    }
  }

}

module.exports = InscricaoController;
