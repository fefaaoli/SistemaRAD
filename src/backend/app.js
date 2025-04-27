// backend/app.js
require('dotenv').config(); // Carrega variáveis de ambiente
const express = require('express');
const cors = require('cors'); // Importando CORS para permitir requisições externas
const bodyParser = require('body-parser'); // Middleware para processamento de corpo de requisição
const sequelize = require('./config/database'); // Importando conexão com o banco
const { verificarToken } = require('./controllers/authController'); // Função de autenticação com token

const app = express();
const port = 3000; // Ou a porta que você preferir

// Middlewares
app.use(express.json()); // Substitui body-parser para JSON
app.use(cors()); // Habilita CORS

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const horarioRoutes = require("./routes/horarioRoutes");
const dataLimiteRoutes = require('./routes/dataLimiteRoutes');

// Uso das rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/docente', docenteRoutes);
app.use("/horarios", horarioRoutes);
app.use('/api/admin', dataLimiteRoutes);

// Definir a rota para o gerenciamento de disciplinas com autenticação
app.use('/api/disciplinas', verificarToken, disciplinaRoutes);

// Rota inicial (pode ser substituída por outras rotas que você tenha)
app.get('/', (req, res) => {
  res.send('Bem-vindo à API de Gerenciamento de Disciplinas');
});

// Middleware para capturar erros globais
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Conexão com o banco de dados e inicialização do servidor
sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});

