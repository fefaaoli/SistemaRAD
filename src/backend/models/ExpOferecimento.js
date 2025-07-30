module.exports = (sequelize, DataTypes) => {
  const ExpOferecimento = sequelize.define('ExpOferecimento', {
    periodo: DataTypes.STRING(10),
    aid: DataTypes.INTEGER
  }, {
    tableName: 'exp_oferecimento',
    timestamps: false
  });
  return ExpOferecimento;
};