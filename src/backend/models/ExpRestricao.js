const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ExpRestricao = sequelize.define('exp_restricao', {
  docente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  periodo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  hordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  dordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'exp_restricao',
  timestamps: false,
  // Evita que o Sequelize tente adicionar coluna 'id'
  freezeTableName: true
});

module.exports = ExpRestricao;
