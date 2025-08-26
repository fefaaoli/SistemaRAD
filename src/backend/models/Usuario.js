const { DataTypes } = require('sequelize');
const sequelize = require('../database');

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
    }
}, {
    timestamps: false, 
    tableName: 'usuarios' 
});

module.exports = Usuario;