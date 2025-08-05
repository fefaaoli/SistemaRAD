module.exports = (sequelize, DataTypes) => {
  const Restricao = sequelize.define('exp_restricao', {
    docente: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    periodo: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    hordem: {
      type: DataTypes.INTEGER,
      primaryKey: true  // Adicionado como chave primária composta
    },
    dordem: {
      type: DataTypes.INTEGER,
      primaryKey: true  // Adicionado como chave primária composta
    }
  }, {
    timestamps: false,
    tableName: 'exp_restricao',
    indexes: [
      {
        unique: true,
        fields: ['docente', 'periodo', 'hordem', 'dordem']
      }
    ]
  });

  return Restricao;
};