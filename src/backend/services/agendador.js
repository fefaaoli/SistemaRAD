const cron = require('node-cron');
const { enviarLembrete } = require('./emailService');

function iniciarAgendamento() {
  // Verifica diariamente às 8h
  cron.schedule('0 8 * * *', async () => {
    const hoje = new Date();
    
    // Busca todos os períodos ativos
    const prazos = await DataLimite.findAll();
    
    for (const prazo of prazos) {
      const diasRestantes = Math.ceil((prazo.data_limite - hoje) / (1000 * 60 * 60 * 24));
      
      // Envia e-mails para prazos próximos
      if (diasRestantes === 7 || diasRestantes === 1) {
        await enviarLembrete(diasRestantes, prazo.periodo);
      }
    }
  });
}

module.exports = { iniciarAgendamento };