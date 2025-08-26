const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario'); // ajuste o caminho se necessário
const sequelize = require('./database'); // ajuste se necessário

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco OK!');

    // Buscar todos os usuários
    const usuarios = await Usuario.findAll();

    for (const usuario of usuarios) {
      // Se a senha já parece hash (começa com $2a$), ignorar
      if (usuario.senha.startsWith('$2a$')) {
        console.log(`Usuário ${usuario.email} já possui hash.`);
        continue;
      }

      // Gerar hash da senha
      const hash = await bcrypt.hash(usuario.senha, 12);

      // Atualizar o usuário
      await usuario.update({ senha: hash });
      console.log(`Senha do usuário ${usuario.email} atualizada!`);
    }

    console.log('Todas as senhas foram atualizadas.');
    process.exit(0);

  } catch (error) {
    console.error('Erro ao atualizar senhas:', error);
    process.exit(1);
  }
})();
