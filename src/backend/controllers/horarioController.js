// horarioController.js
const db = require('../config/database');

// Adicionar horário
const adicionarHorario = async (req, res) => {
    const { periodo, valor, cat, ordem } = req.body;
    try {
        await db.query('INSERT INTO rr_horario (periodo, ordem, cat, valor) VALUES (?, ?, ?, ?)',
            [periodo, ordem, cat, valor]);
        return res.json({ success: true, message: "Horário adicionado com sucesso!" });
    } catch (error) {
        console.error("Erro ao adicionar horário:", error.message);
        return res.status(500).json({ success: false, message: "Erro ao adicionar horário." });
    }
};

// Remover horário
const removerHorario = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM rr_horario WHERE id = ?', [id]);
        return res.json({ success: true, message: "Horário removido com sucesso!" });
    } catch (error) {
        console.error("Erro ao remover horário:", error.message);
        return res.status(500).json({ success: false, message: "Erro ao remover horário." });
    }
};

// Salvar e disponibilizar horários
const salvarHorario = async (req, res) => {
    const { periodo } = req.body;
    try {
        await db.query('UPDATE rr_horario SET disponivel = 1 WHERE periodo = ?', [periodo]);
        return res.json({ success: true, message: "Horários salvos e disponibilizados para docentes." });
    } catch (error) {
        console.error("Erro ao salvar horários:", error.message);
        return res.status(500).json({ success: false, message: "Erro ao salvar horários." });
    }
};

// Configurar horário (adicionar ou remover)
const configurarHorario = async (req, res) => {
    const { acao, id, periodo, valor, cat, ordem } = req.body;
    try {
        if (acao === "adicionar") {
            await db.query('INSERT INTO rr_horario (periodo, ordem, cat, valor) VALUES (?, ?, ?, ?)',
                [periodo, ordem, cat, valor]);
            return res.json({ success: true, message: "Horário adicionado com sucesso!" });
        } else if (acao === "remover") {
            await db.query('DELETE FROM rr_horario WHERE id = ?', [id]);
            return res.json({ success: true, message: "Horário removido com sucesso!" });
        } else {
            return res.status(400).json({ success: false, message: "Ação inválida." });
        }
    } catch (error) {
        console.error("Erro ao configurar horário:", error.message);
        return res.status(500).json({ success: false, message: "Erro ao configurar horário." });
    }
};

module.exports = { adicionarHorario, removerHorario, salvarHorario, configurarHorario };
