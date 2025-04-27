const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Conexão com o banco

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  setor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abvsetor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // 0 para docente, 1 para admin
  },
  senha: { 
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Método para criptografar a senha antes de salvar no banco
const bcrypt = require('bcryptjs');

Usuario.beforeCreate(async (usuario) => {
  usuario.senha = await bcrypt.hash(usuario.senha, 10);
});

Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('senha')) {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
  }
});

module.exports = Usuario;
