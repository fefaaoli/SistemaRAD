const db = require('../config/db');

const removerRestricoes = async (docente, periodo) => {
    await db.query('DELETE FROM exp_restricao WHERE docente = ? AND periodo = ?', [docente, periodo]);
};

const adicionarRestricoes = async (docente, periodo, restricoes) => {
    for (const { hordem, dordem } of restricoes) {
        await db.query('INSERT INTO exp_restricao (docente, periodo, hordem, dordem) VALUES (?, ?, ?, ?)', [docente, periodo, hordem, dordem]);
    }
};

module.exports = { removerRestricoes, adicionarRestricoes };
