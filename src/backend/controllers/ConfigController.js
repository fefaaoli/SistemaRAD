const { DataLimite } = require('../models');

exports.definirDataLimite = async (req, res) => {
  // 1. Recebe os dados do Postman
  const { periodo, dataLimite } = req.body;

  // 2. Validação Simples (teste no Postman)
  if (!periodo || !dataLimite) {
    return res.status(400).json({
      success: false,
      error: "Envie 'periodo' (ex: 2025/1) e 'dataLimite' (DD/MM/AAAA)"
    });
  }

  // 3. Verifica formato da data (DD/MM/AAAA)
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataLimite)) {
    return res.status(400).json({
      success: false,
      error: "Formato de data inválido. Use DD/MM/AAAA"
    });
  }

  try {
    // 4. Converte para formato do Banco (AAAA-MM-DD)
    const [dia, mes, ano] = dataLimite.split('/');
    const dataParaBanco = `${ano}-${mes}-${dia}`;

    // 5. Cria ou atualiza no banco
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

    // 6. Resposta de sucesso
    res.status(200).json({
      success: true,
      message: `Data limite para ${periodo} definida como ${dataLimite}`,
      data: {
        periodo,
        data_limite: dataParaBanco
      }
    });

  } catch (err) {
    // 7. Tratamento de erro
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
      attributes: ['periodo', 'data_limite'] // Só retorna esses campos
    });
    
    res.status(200).json({
      success: true,
      data: data || null // Retorna null se não encontrar
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};