const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const DataLimite = sequelize.define('DataLimite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  periodo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true // Garante que cada período tenha apenas uma data limite
  },
  data_limite: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'exp_data_limite',
  timestamps: false
});

module.exports = DataLimite;