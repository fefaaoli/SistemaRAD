const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Horario = sequelize.define('Horario', {
  periodo: {
    type: DataTypes.STRING(10),
    primaryKey: true // Importante manter como PK
  },
  ordem: DataTypes.INTEGER,
  cat: DataTypes.STRING(4),
  valor: DataTypes.STRING(25)
}, {
  tableName: 'exp_horario',
  timestamps: false,
  id: false, // Isso resolve o erro!
  freezeTableName: true
});

module.exports = Horario;