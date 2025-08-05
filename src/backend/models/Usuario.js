const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Ajuste o caminho conforme sua estrutura

const Usuario = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    setor: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    abvsetor: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'senha_temporaria'
    }
}, {
    timestamps: false, // Se você não usa campos de timestamp
    tableName: 'usuarios' // Nome exato da tabela no banco
});

module.exports = Usuario;