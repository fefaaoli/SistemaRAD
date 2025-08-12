const Horario = require('../models/Horario');
const { Config } = require('../database');

class AdminConfigController {
  // Busca o valor atual da restrição (padrão: 15)
  static async getRestricao(req, res) {
    try {
      const config = await Config.findOne({ where: { nome: 'restricao' } });
      const valor = config ? parseInt(config.valor) : 15; // Default 15

      // Calcula o máximo de indisponíveis (totalHorarios - valor - 1)
const totalHorarios = await Horario.count({ 
  where: { periodo: req.query.periodo } 
});

      const maxIndisponiveis = Math.max(0, totalHorarios - valor - 1); // Ex: 20 - 15 - 1 = 4

      console.log('Config encontrada:', config?.dataValues);
      console.log('Valor numérico:', parseInt(config.valor));
      console.log('Total de horários:', totalHorarios);

      res.json({ 
        minSlotsDisponiveis: valor,
        maxIndisponiveis,
        totalHorarios
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
  }

  // Atualiza o valor da restrição (15)
static async updateRestricao(req, res) {
  const { minSlotsDisponiveis } = req.body;
  try {
    const config = await Config.findOne({ where: { nome: 'restricao' } });

    if (config) {
      config.valor = minSlotsDisponiveis.toString();
      await config.save();
    } else {
      await Config.create({
        nome: 'restricao',
        valor: minSlotsDisponiveis.toString()
      });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Erro no updateRestricao:', error);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
}

}

module.exports = AdminConfigController;