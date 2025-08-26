const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const app = express();

// Configurações básicas
app.use(cors({
  origin: 'http://localhost:3000', // Porta padrão do React
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})); // Permite conexão com o frontend

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend da Gestão de Horários está rodando! 🚀');
});

app.use(express.urlencoded({ extended: true })); // Para parsing de application/x-www-form-urlencoded

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para forms HTML

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const periodoRoutes = require('./routes/periodos');
app.use('/api/admin/periodos', periodoRoutes); // Cria um novo período e insere os horários padrão

const configRoutes = require('./routes/configRestricoes');
app.use('/api/admin/config', configRoutes); // Define ou atualiza a data limite para esse período

const disciplinaRoutes = require('./routes/disciplinas');
app.use('/api/admin/disciplinas', disciplinaRoutes);

const adminHorarioRoutes = require('./routes/horarioRoutes');
app.use('/api/admin/horarios', adminHorarioRoutes);

const adminRoutes = require('./routes/configHorarioRestricoes');
app.use('/api/admin', adminRoutes);

const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/admin', usuarioRoutes);

const inscricaoRoutes = require('./routes/inscricaoRoutes');
app.use('/api/inscricao', inscricaoRoutes);

const indisponibilidadeRoutes = require('./routes/indisponibilidadeRoutes');
app.use('/indisponibilidades', indisponibilidadeRoutes);

const docenteRoutes = require('./routes/docenteRoutes');
app.use('/api/docentes', docenteRoutes);

const exportRoutes = require('./routes/exportRoutes');
app.use('/api', exportRoutes);

// Importe o agendador
const { iniciarAgendamento } = require('./services/agendador');

// Inicia o agendador quando o servidor começa
if (process.env.NODE_ENV !== 'test') {
  iniciarAgendamento();
}

module.exports = app;
