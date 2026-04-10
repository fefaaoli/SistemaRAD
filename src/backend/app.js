const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const app = express();

// Configurações básicas
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://143.107.158.74:3000",
    "http://localhost:3001",
    "http://143.107.158.74:3001"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend da Gestão de Horários está rodando! 🚀');
});

app.use(express.urlencoded({ extended: true })); 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const periodoRoutes = require('./routes/periodos');
app.use('/api/admin/periodos', periodoRoutes); 

const configRoutes = require('./routes/configRestricoes');
app.use('/api/admin/config', configRoutes); 

const disciplinaRoutes = require('./routes/disciplinas');
app.use('/api/admin/disciplinas', disciplinaRoutes);

const adminHorarioRoutes = require('./routes/horarioRoutes');
app.use('/api/admin/horarios', adminHorarioRoutes);

const adminRoutes = require('./routes/configHorarioRestricoes');
app.use('/api/admin', adminRoutes);

const configHorarioRestricoes = require('./routes/configHorarioRestricoes')
app.use('/admin', configHorarioRestricoes);

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

const { iniciarAgendamento } = require('./services/agendador');

if (process.env.NODE_ENV !== 'test') {
  iniciarAgendamento();
}

module.exports = app;