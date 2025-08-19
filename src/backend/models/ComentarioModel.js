module.exports = (sequelize, DataTypes) => {
  const InscricaoComentario = sequelize.define('InscricaoComentario', {
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    aid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    periodo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    idioma_en: {
      type: DataTypes.TINYINT,
      allowNull: true // 1 = sim, 0 = não
    },
    apoio_leia: {
      type: DataTypes.TINYINT,
      allowNull: true // 1 = sim, 0 = não
    },
    max_alunos: {
      type: DataTypes.INTEGER,
      allowNull: true 
    }
  }, {
    tableName: 'exp_insc_comentario',
    timestamps: false
  });

  return InscricaoComentario;
};
