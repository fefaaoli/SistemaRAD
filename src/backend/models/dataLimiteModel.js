const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpDataLimite = sequelize.define('ExpDataLimite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  periodo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  data_limite: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'exp_data_limite',
  timestamps: false
});

module.exports = ExpDataLimite;
