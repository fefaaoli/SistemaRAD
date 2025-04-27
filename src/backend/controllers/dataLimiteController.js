const ExpDataLimite = require('../models/ExpDataLimite');

// Criar ou atualizar a data limite para um período
const definirDataLimite = async (req, res) => {
  const { periodo, data_limite } = req.body;

  try {
    const [registro, criado] = await ExpDataLimite.findOrCreate({
      where: { periodo },
      defaults: { data_limite }
    });

    if (!criado) {
      registro.data_limite = data_limite;
      await registro.save();
    }

    res.json({ success: true, message: 'Data limite configurada com sucesso.', data: registro });
  } catch (error) {
    console.error('Erro ao configurar data limite:', error);
    res.status(500).json({ success: false, message: 'Erro ao configurar data limite.' });
  }
};

// Buscar data limite de um período
const buscarDataLimite = async (req, res) => {
  const { periodo } = req.params;

  try {
    const registro = await ExpDataLimite.findOne({ where: { periodo } });

    if (!registro) {
      return res.status(404).json({ success: false, message: 'Data limite não encontrada.' });
    }

    res.json({ success: true, data: registro });
  } catch (error) {
    console.error('Erro ao buscar data limite:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar data limite.' });
  }
};

module.exports = { definirDataLimite, buscarDataLimite };
