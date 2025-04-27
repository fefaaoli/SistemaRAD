// controllers/restricoesController.js
const RestricoesModel = require('../models/restricoesModel');

const configurarRestricoes = async (req, res) => {
    const { docente, periodo, restricoes } = req.body;
    
    if (!docente || !periodo || !Array.isArray(restricoes)) {
        return res.status(400).json({ success: false, message: "Dados inválidos." });
    }
    
    if (restricoes.length > 4) {
        return res.status(400).json({ success: false, message: "Máximo de 4 horários permitidos para restrição." });
    }
    
    try {
        await RestricoesModel.removerRestricoes(docente, periodo);
        await RestricoesModel.adicionarRestricoes(docente, periodo, restricoes);
        return res.json({ success: true, message: "Restrições configuradas com sucesso." });
    } catch (error) {
        console.error("Erro ao configurar restrições:", error);
        return res.status(500).json({ success: false, message: "Erro ao configurar restrições." });
    }
};

module.exports = { configurarRestricoes };