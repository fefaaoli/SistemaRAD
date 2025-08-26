const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { gerarXML } = require('../export-fet/exportFET');

router.get('/exportar-fet', async (req, res) => {
  try {
    const nomeArquivo = await gerarXML();
    const filePath = path.join(__dirname, '../export-fet/exports', nomeArquivo);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }

    res.download(filePath, nomeArquivo, (err) => {
      if (err) {
        console.error('Erro no download:', err);
        res.status(500).send('Erro ao enviar o arquivo');
      }
    });
  } catch (err) {
    console.error('Erro na rota exportar-fet:', err);
    res.status(500).json({ message: 'Erro ao gerar XML' });
  }
});

module.exports = router;
