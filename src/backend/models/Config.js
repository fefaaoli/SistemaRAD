// models/Config.js
module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define('config', {
    nome: {
      type: DataTypes.STRING(30),
      primaryKey: true
    },
    valor: DataTypes.TEXT
  }, {
    tableName: 'config',
    timestamps: false
  });

  // models/Config.js
  Config.upsert = async function(config) {
    return await this.create(config, {
      updateOnDuplicate: ['valor']
      });
    };

  // Busca configuração por nome
  Config.getValor = async (nome, padrao) => {
    const config = await Config.findOne({ where: { nome } });
    return config ? parseInt(config.valor) : padrao;
  };

  return Config;
};