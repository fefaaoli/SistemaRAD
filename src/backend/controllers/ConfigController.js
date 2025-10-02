const { DataLimite } = require('../models');

exports.definirDataLimite = async (req, res) => {
  const { periodo, dataLimite } = req.body;

  if (!periodo || !dataLimite) {
    return res.status(400).json({
      success: false,
      error: "Envie 'periodo' (ex: 2025/1) e 'dataLimite' (DD/MM/AAAA)"
    });
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataLimite)) {
    return res.status(400).json({
      success: false,
      error: "Formato de data inválido. Use DD/MM/AAAA"
    });
  }

  try {
    const [dia, mes, ano] = dataLimite.split('/');
    const dataParaBanco = `${ano}-${mes}-${dia}`;

    const [data, created] = await DataLimite.findOrCreate({
      where: { periodo },
      defaults: { data_limite: dataParaBanco }
    });

    if (!created) {
      await DataLimite.update(
        { data_limite: dataParaBanco },
        { where: { periodo } }
      );
    }

    res.status(200).json({
      success: true,
      message: `Data limite para ${periodo} definida como ${dataLimite}`,
      data: {
        periodo,
        data_limite: dataParaBanco
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.consultarDataLimite = async (req, res) => {
  const { periodo } = req.params;

  try {
    const data = await DataLimite.findOne({
      where: { periodo },
      attributes: ['periodo', 'data_limite']
    });

    res.status(200).json({
      success: true,
      data: data || null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.consultarUltimaDataLimite = async (req, res) => {
  try {
    const data = await DataLimite.findOne({
      order: [['id', 'DESC']], // pega o registro mais recente pelo id
      attributes: ['periodo', 'data_limite']
    });

    res.status(200).json({
      success: true,
      data: data || null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

