const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carrega as variáveis do .env

// Configuração do Sequelize para conectar ao MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, 
    logging: false, // Desativa logs do Sequelize no console
  }
);

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log('Conectado ao banco de dados!'))
  .catch((err) => console.error('Erro ao conectar:', err));

module.exports = sequelize;
