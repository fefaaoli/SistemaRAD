const db = require("../config/database");

const getMaxPeriodo = async () => {
    const [result] = await db.query("SELECT MAX(periodo) AS maxPeriodo FROM rr_horario");
    return result[0]?.maxPeriodo || "0";
};

const inserirHorariosPadrao = async (periodo) => {
    const horarios = [
        ["2a feira", "dia", 10],
        ["3a feira", "dia", 20],
        ["4a feira", "dia", 30],
        ["5a feira", "dia", 40],
        ["6a feira", "dia", 50],
        ["08:00 às 09:40", "hora", 10],
        ["10:00 às 11:40", "hora", 20],
        ["19:00 às 20:40", "hora", 50],
        ["20:50 às 22:30", "hora", 60]
    ];

    for (const [valor, cat, ordem] of horarios) {
        await db.query("INSERT INTO rr_horario (periodo, ordem, cat, valor) VALUES (?, ?, ?, ?)", [periodo, ordem, cat, valor]);
    }
};

const adicionarHorario = async (periodo, ordem, cat, valor) => {
    await db.query("INSERT INTO rr_horario (periodo, ordem, cat, valor) VALUES (?, ?, ?, ?)", [periodo, ordem, cat, valor]);
};

const removerHorario = async (idHorario) => {
    await db.query("DELETE FROM rr_horario WHERE id = ?", [idHorario]);
};

const getHorariosPorPeriodo = async (periodo) => {
    const [result] = await db.query("SELECT * FROM rr_horario WHERE periodo = ?", [periodo]);
    return result;
};

module.exports = {
    getMaxPeriodo,
    inserirHorariosPadrao,
    adicionarHorario,
    removerHorario,
    getHorariosPorPeriodo
};

