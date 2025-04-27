const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpHorario = sequelize.define('ExpHorario', {
  periodo: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cat: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
  valor: {
    type: DataTypes.STRING(25),
    allowNull: false
  }
}, {
  tableName: 'exp_horario', 
  timestamps: false 
});

module.exports = ExpHorario;
