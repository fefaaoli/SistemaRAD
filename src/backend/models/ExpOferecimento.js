module.exports = (sequelize, DataTypes) => {
  const ExpOferecimento = sequelize.define('ExpOferecimento', {
    periodo: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    aid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'exp_oferecimento',
    timestamps: false, // Não tem created_at/updated_at
    underscored: true // Mantém o padrão de nomeação snake_case
  });

  // Associações (opcional, só se for usar eager loading)
  ExpOferecimento.associate = (models) => {
    ExpOferecimento.belongsTo(models.Disciplina, {
      foreignKey: 'aid',
      as: 'disciplina'
    });
  };

  return ExpOferecimento;
};