const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Horario = sequelize.define('Horario', {
  periodo: {
    type: DataTypes.STRING(10),
    primaryKey: true
  },
  ordem: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  cat: {
    type: DataTypes.STRING(4),
    primaryKey: true
  },
  valor: DataTypes.STRING(25)
}, {
  tableName: 'exp_horario',
  timestamps: false,
  freezeTableName: true,
  // Adicione estas configurações críticas:
  id: false, // Desativa a coluna id padrão
  createdAt: false,
  updatedAt: false
});

module.exports = Horario;