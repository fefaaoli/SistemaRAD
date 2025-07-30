const { DataLimite } = require('../models');

module.exports = async (req, res, next) => {
  const { periodo } = req.body; // Ou req.params, depende da sua rota

  try {
    const prazo = await DataLimite.findOne({ where: { periodo } });
    
    if (prazo && new Date(prazo.data_limite) < new Date()) {
      return res.status(403).json({
        success: false,
        error: "Período de edição encerrado! A data limite já passou."
      });
    }
    
    next(); // Se tudo OK, continua
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: "Erro ao verificar prazo" 
    });
  }
};