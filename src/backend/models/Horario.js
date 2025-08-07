const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Horario = sequelize.define('Horario', {
  periodo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  cat: {
    type: DataTypes.STRING(4),
    allowNull: false,
    primaryKey: true,
    defaultValue: 'HORA'
  },
  valor: {
    type: DataTypes.STRING(25),
    allowNull: false
  }
}, {
  tableName: 'exp_horario',
  timestamps: false,
  freezeTableName: true,
  id: false,
  indexes: [
    {
      unique: true,
      fields: ['periodo', 'ordem', 'cat']
    },
    {
      fields: ['periodo']
    }
  ]
});

module.exports = Horario;