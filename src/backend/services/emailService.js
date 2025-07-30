const nodemailer = require('nodemailer');
const { DataLimite } = require('../models');
const { Usuario } = require('../models'); // Assumindo que existe um model de usuários

// Configuração do e-mail (ajuste com seus dados SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro (ex: 'outlook')
  auth: {
    user: process.env.EMAIL_USER, // Crie essas variáveis no .env
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar e-mails
async function enviarLembrete(diasRestantes, periodo) {
  try {
    // 1. Busca a data limite
    const dataLimite = await DataLimite.findOne({ 
      where: { periodo },
      attributes: ['data_limite']
    });

    if (!dataLimite) return;

    // 2. Busca todos os docentes
    const docentes = await Usuario.findAll({ 
      where: { admin: false }, // Filtra apenas docentes
      attributes: ['email', 'nome']
    });

    // 3. Envia e-mails
    for (const docente of docentes) {
      await transporter.sendMail({
        from: '"Sistema de Horários" <sistema@faculdade.edu>',
        to: docente.email,
        subject: `⚠️ Lembrete: Faltam ${diasRestantes} dias para o prazo final!`,
        html: `
          <p>Prezado(a) ${docente.nome},</p>
          <p>Faltam <strong>${diasRestantes} dias</strong> para o encerramento do prazo de seleção de disciplinas (${periodo}).</p>
          <p>Data limite: <strong>${dataLimite.data_limite.toLocaleDateString('pt-BR')}</strong></p>
          <p>Acesse o sistema para realizar suas escolhas!</p>
        `
      });
    }

    console.log(`E-mails de ${diasRestantes} dias enviados com sucesso!`);
  } catch (error) {
    console.error('Erro ao enviar e-mails:', error);
  }
}

module.exports = { enviarLembrete };