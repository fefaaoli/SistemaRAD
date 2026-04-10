const app = require('./app.js');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend rodando externamente em http://143.107.158.74:${PORT}`);
  console.log(`Backend rodando localmente em http://localhost:${PORT}`);
});

// Tratamento de erros
app.on('error', (error) => {
  console.error('Erro ao iniciar servidor:', error);
});