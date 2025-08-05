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
      allowNull: false,
      comment: 'Código da disciplina (ex: MAT001)'
    },
    disciplina: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Nome completo da disciplina'
    },
    cred: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Número de créditos'
    },
    turma: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Turma da disciplina (ex: T01, N02)'
    },
    tipo: {
      type: DataTypes.STRING(25),
      allowNull: false,
      comment: 'Tipo (Obrigatória, Optativa, etc)'
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observações adicionais'
    }
  }, {
    tableName: 'exp_atividade',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    comment: 'Tabela de disciplinas do sistema'
  });

  // ASSOCIAÇÕES ====================================================
  Disciplina.associate = function(models) {
    Disciplina.hasMany(models.ExpOferecimento, {
      foreignKey: 'aid',
      as: 'ExpOferecimentos'
    });
  };

  // MÉTODOS PERSONALIZADOS =========================================
  Disciplina.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Remove campos sensíveis se necessário
    // delete values.campo_sensivel;
    
    return values;
  };

  return Disciplina;
};