const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Disciplina = sequelize.define('Disciplina', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cod: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  disciplina: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  cred: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  turma: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = Disciplina;
