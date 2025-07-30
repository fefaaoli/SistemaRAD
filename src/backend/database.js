require('dotenv').config(); // Carrega as variáveis do .env
const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco usando variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nome do banco
  process.env.DB_USER,      // Usuário
  process.env.DB_PASSWORD,  // Senha
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false // Desativa logs de SQL no console (opcional)
  }
);

// Testa a conexão 
sequelize.authenticate()
  .then(() => console.log('Conectado ao banco de dados!'))
  .catch(err => console.error('Erro na conexão:', err));

module.exports = sequelize;
