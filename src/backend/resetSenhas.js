const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario'); // ajuste se necessário
const sequelize = require('./database'); // ajuste se necessário

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco OK!');

    const senhaTemporaria = 'Senha123!';
    const hashTemporario = await bcrypt.hash(senhaTemporaria, 12);

    // Atualiza todas as senhas de uma vez
    const [qtdAtualizados] = await Usuario.update(
      { senha: hashTemporario },
      { where: {} }
    );

    console.log(`${qtdAtualizados} usuários atualizados com a senha temporária.`);
    console.log(`Todos os usuários podem logar com: ${senhaTemporaria}`);

    process.exit(0);
  } catch (error) {
    console.error('Erro ao redefinir senhas:', error);
    process.exit(1);
  }
})();
