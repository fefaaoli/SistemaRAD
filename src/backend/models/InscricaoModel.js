const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Inscricao = sequelize.define('Inscricao', {
  aid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  did: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  periodo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'exp_inscricao',
  timestamps: false
});

// Funções auxiliares
async function addInscricao(aid, did, periodo) {
  const existente = await Inscricao.findOne({ where: { aid, did, periodo } });
  if (existente) throw new Error('Disciplina já selecionada por este docente.');

  return await Inscricao.create({ aid, did, periodo });
}

async function removeInscricao(aid, did, periodo) {
  return await Inscricao.destroy({ where: { aid, did, periodo } });
}

async function getInscricoesByDocente(did, periodo) {
  const [results] = await sequelize.query(`
  SELECT DISTINCT 
    ea.cod,
    ea.disciplina,
    ea.turma,
    ea.turno,
    ea.tipo,
    ea.cred,
    ei.aid,
    ei.did,
    ei.periodo,
    /* Campos da tabela de comentários */
    ec.comentario,
    ec.idioma_en,
    ec.apoio_leia,
    ec.max_alunos
  FROM exp_inscricao ei
  JOIN exp_oferecimento eo 
    ON eo.aid = ei.aid AND eo.periodo = ei.periodo
  JOIN exp_atividade ea 
    ON ea.id = ei.aid
  /* Unindo com a tabela de comentários usando os IDs e o Período */
  LEFT JOIN exp_insc_comentario ec
    ON ec.aid = ei.aid AND ec.did = ei.did AND ec.periodo = ei.periodo
  WHERE ei.did = :did AND ei.periodo = :periodo;
  `, {
    replacements: { did, periodo }
  });

  return results;
}

module.exports = {
  Inscricao,
  addInscricao,
  removeInscricao,
  getInscricoesByDocente
};