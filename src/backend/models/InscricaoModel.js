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
    ea.tipo,
    ea.cred,
    ei.aid,
    ei.did,
    ei.periodo
  FROM exp_inscricao ei
  JOIN exp_oferecimento eo 
    ON eo.aid = ei.aid AND eo.periodo = ei.periodo
  JOIN exp_atividade ea 
    ON ea.id = ei.aid
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
