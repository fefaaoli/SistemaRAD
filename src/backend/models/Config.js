const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Config = sequelize.define('Config', {
  nome: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'config',
  timestamps: false
});

module.exports = Config;
