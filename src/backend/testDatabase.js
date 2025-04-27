const sequelize = require('./config/database');

sequelize.sync() // Sincroniza os modelos com o banco (opcional)
  .then(() => {
    console.log('✅ Banco de dados sincronizado!');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Erro ao sincronizar o banco:', err);
    process.exit(1);
  });
