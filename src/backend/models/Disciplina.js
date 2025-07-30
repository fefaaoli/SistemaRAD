module.exports = (sequelize, DataTypes) => {
  const Disciplina = sequelize.define('Disciplina', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cod: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    disciplina: {  
      type: DataTypes.STRING(60),
      allowNull: false
    },
    cred: {  
      type: DataTypes.INTEGER,
      allowNull: false
    },
    turma: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(25),  
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true  
    }
  }, {
    tableName: 'exp_atividade',  
    timestamps: false,           // Não usa created_at e updated_at
    underscored: true,           // Opcional: mantém padrão de nomenclatura
    freezeTableName: true        // Impede pluralização automática
  });

  return Disciplina;
};